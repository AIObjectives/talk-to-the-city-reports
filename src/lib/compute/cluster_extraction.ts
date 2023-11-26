import openai from 'openai';
import { readFileFromGCS, uploadDataToGCS } from '$lib/utils';

async function gpt(
	apiKey: string,
	systemPrompt: string,
	promptTemplate: string,
	replacements: { [key: string]: string },
	info,
	error,
	success
) {
	let prompt = promptTemplate;
	for (const [key, value] of Object.entries(replacements)) {
		prompt = prompt.replace(`{${key}}`, value);
	}
	const OpenAI = new openai({ apiKey, dangerouslyAllowBrowser: true });
	console.log('calling openai...');
	info('Calling OpenAI');
	const res = await OpenAI.chat.completions.create({
		messages: [
			{ role: 'system', content: systemPrompt },
			{ role: 'user', content: prompt }
		],
		model: 'gpt-4-1106-preview',
		response_format: { type: 'json_object' },
		temperature: 0.1
	});
	console.log('got result from openai...', res);
	return res.choices[0].message.content!;
}

export const cluster_extraction = async (node, inputData, info, error, success, slug) => {
	console.log('Computing', node.data.label, 'with input data', inputData);
	const csv = inputData.csv || inputData[node.data.input_ids.csv];
	const open_ai_key = inputData.open_ai_key || inputData[node.data.input_ids.open_ai_key];
	if (!csv || csv.length == 0) {
		node.data.dirty = false;
		return;
	}

	node.data.dirty = node.data.csv_length != csv.length;
	console.log('node.data.dirty', node.data.dirty);
	console.log('node.data.csv_length', node.data.csv_length);
	console.log('csv.length', csv.length);

	if (!node.data.dirty && node.data.gcs_path) {
		let doc = await readFileFromGCS(node);
		if (typeof doc === 'string') {
			doc = JSON.parse(doc);
		}
		node.data.output = doc;
		node.data.dirty = false;
		console.log('Already computed', node.data.label);
		return node.data.output;
	}
	info('Computing' + node.data.label);
	node.data.csv_length = csv.length;
	const { prompt, system_prompt } = node.data;
	const result = await gpt(
		open_ai_key,
		system_prompt,
		prompt,
		{
			comments: csv.map((x: any) => x['comment-body']).join('\n')
		},
		info,
		error,
		success
	);
	node.data.output = JSON.parse(result);
	await uploadDataToGCS(node, node.data.output, slug);
	node.data.dirty = false;
	success('Done computing ' + node.data.label);
	success('Done computing ' + node.data.label, node.data.output);
	return node.data.output;
};
