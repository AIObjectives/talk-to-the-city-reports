import openai from 'openai';
import { readFileFromGCS, uploadDataToGCS } from '$lib/utils';
import { summary_prompt } from '$lib/prompts';

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
	console.debug('systemPrompt', systemPrompt);
	console.debug('prompt', prompt);
	const OpenAI = new openai({ apiKey, dangerouslyAllowBrowser: true });
	console.log('calling openai...');
	info('Calling OpenAI');
	try {
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
	} catch (e) {
		error('Error calling OpenAI: ' + e.error.message);
		console.log('Error calling openai...', e.error.message);
	}
}

export const cluster_extraction = async (node, inputData, context, info, error, success, slug) => {
	console.log('Computing', node.data.label, 'with input data', inputData);
	const csv = inputData.csv || inputData[node.data.input_ids.csv];
	const open_ai_key = inputData.open_ai_key || inputData[node.data.input_ids.open_ai_key];
	if (!csv || csv.length == 0) {
		node.data.dirty = false;
		return;
	}

	if (!node.data.dirty && node.data.csv_length == csv.length && node.data.gcs_path) {
		let doc = await readFileFromGCS(node);
		if (typeof doc === 'string') {
			doc = JSON.parse(doc);
		}
		node.data.output = doc;
		node.data.dirty = false;
		console.log('Already computed', node.data.label);
		return node.data.output;
	}

	if (context == 'run' && open_ai_key && csv && csv.length > 0) {
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
		return node.data.output;
	}
};

interface ClusterExtractionData extends BaseData {
	output: object;
	text: string;
	system_prompt: string;
	prompt: string;
	csv_length: number;
}

type ClusterExtractionNode = DGNodeInterface & {
	data: ClusterExtractionData;
};

export const cluster_extraction_node: ClusterExtractionNode = {
	id: 'cluster_extraction',
	data: {
		label: 'Cluster Extraction',
		output: {},
		text: '',
		system_prompt:
			'You are a professional research assistant. You have helped run many public consultations, surveys and citizen assemblies.',
		prompt: summary_prompt,
		csv_length: 0,
		dirty: false,
		compute_type: 'cluster_extraction_v0',
		input_ids: { open_ai_key: '', csv: '' }
	},
	position: { x: 100, y: 100 },
	type: 'prompt_v0'
};
