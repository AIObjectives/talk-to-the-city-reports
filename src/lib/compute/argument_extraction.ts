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
	console.log('calling openai on ...');
	info('Calling OpenAI');
	let prompt = promptTemplate;
	for (const [key, value] of Object.entries(replacements)) {
		prompt = prompt.replace(`{${key}}`, value);
	}
	const OpenAI = new openai({ apiKey, dangerouslyAllowBrowser: true });
	const res = await OpenAI.chat.completions.create({
		messages: [
			{ role: 'system', content: systemPrompt },
			{ role: 'user', content: prompt }
		],
		model: 'gpt-4-1106-preview',
		response_format: { type: 'json_object' },
		temperature: 0.1
	});
	return res.choices[0].message.content!;
}

async function processInChunks(array, handler, chunkSize) {
	for (let i = 0; i < array.length; i += chunkSize) {
		const chunk = array.slice(i, i + chunkSize);
		await Promise.all(chunk.map((item) => handler(item)));
	}
}

export const argument_extraction = async (node, inputData, info, error, success, slug) => {
	console.log('Computing', node.data.label, 'with input data', inputData);
	const { prompt, system_prompt } = node.data;
	const csv = inputData.csv || inputData[node.data.input_ids.csv];
	const open_ai_key = inputData.open_ai_key || inputData[node.data.input_ids.open_ai_key];
	const cluster_extraction =
		inputData.cluster_extraction || inputData[node.data.input_ids.cluster_extraction];

	console.log('csv', csv);

	if (!csv || csv.length == 0 || !cluster_extraction) {
		node.data.dirty = false;
		return;
	}

	node.data.dirty = node.data.csv_length != csv.length;

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

	node.data.output = {};

	const csv_by_ids = Object.fromEntries(csv.map((item) => [item['comment-id'], item]));
	async function extract_args(id) {
		const comment = csv_by_ids[id]['comment-body'];
		const interview = csv_by_ids[id]['interview'];
		console.log('running for id', id);
		const response = await gpt(
			open_ai_key,
			system_prompt,
			prompt,
			{
				comment,
				clusters: JSON.stringify(cluster_extraction)
			},
			info,
			error,
			success
		);
		node.data.output[id] = { id, comment, interview, ...JSON.parse(response) };
	}

	node.data.csv_length = csv.length;

	let ids = Object.keys(csv_by_ids);

	console.log('ids', ids);

	try {
		await processInChunks(ids, extract_args, 10);
	} catch (err) {
		console.error(err);
	}
	success('Done computing ' + node.data.label);
	node.data.dirty = false;
	console.log(node.data.output);
	await uploadDataToGCS(node, node.data.output, slug);
	return node.data.output;
};
