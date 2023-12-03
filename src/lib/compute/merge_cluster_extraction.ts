import categories from '$lib/node_categories';

import { readFileFromGCS, uploadDataToGCS } from '$lib/utils';
import { merge_extraction_prompt } from '$lib/prompts';

async function gpt(
	apiKey: string,
	systemPrompt: string,
	promptTemplate: string,
	replacements: { [key: string]: string },
	info: (arg: string) => void,
	error: (arg: string) => void,
	success: (arg: string) => void
) {
	let vitest = import.meta.env.VITEST == 'true';
	let openai = (await import(vitest ? '$lib/mock_open_ai' : 'openai')).default;
	info('Calling OpenAI');
	let prompt = promptTemplate;
	for (const [key, value] of Object.entries(replacements)) {
		prompt = prompt.replace(`{${key}}`, value);
	}
	console.log(prompt);

	const OpenAI = new openai({ apiKey, dangerouslyAllowBrowser: true });
	const messages = [
		{ role: 'system', content: systemPrompt },
		{ role: 'user', content: prompt }
	];
	const res = await OpenAI.chat.completions.create({
		messages,
		model: 'gpt-4-1106-preview',
		response_format: { type: 'json_object' },
		temperature: 0.1
	});
	const resp = res.choices[0].message.content!;
	return resp;
}

async function processInChunks(array, handler, chunkSize) {
	for (let i = 0; i < array.length; i += chunkSize) {
		const chunk = array.slice(i, i + chunkSize);
		await Promise.all(chunk.map((item) => handler(item)));
	}
}

export const merge_cluster_extraction = async (
	node: MergeClusterExtractionNode,
	inputData: object,
	context: string,
	info: (arg: string) => void,
	error: (arg: string) => void,
	success: (arg: string) => void,
	slug: string
) => {
	const csv_key = node.data.input_ids.csv;
	const keys = Object.keys(inputData);
	const cluster_extraction_keys = keys.filter((x) => x != csv_key);
	const cluster_extractions = cluster_extraction_keys.map((x) => inputData[x]);
	const open_ai_key = inputData.open_ai_key || inputData[node.data.input_ids.open_ai_key];

	if (
		!cluster_extractions ||
		cluster_extractions.length == 0 ||
		!(node.data.prompt || node.data.system_prompt)
	) {
		node.data.dirty = false;
		return;
	}

	if (
		!node.data.dirty &&
		node.data.num_cluster_extractions == cluster_extractions.length &&
		node.data.gcs_path
	) {
		let doc = await readFileFromGCS(node);
		if (typeof doc === 'string') {
			doc = JSON.parse(doc);
		}
		node.data.output = doc;
		node.data.dirty = false;
		return node.data.output;
	}

	if (
		context == 'run' &&
		open_ai_key &&
		cluster_extractions &&
		cluster_extractions.length > 0 &&
		open_ai_key
	) {
		info('Computing ' + node.data.label);
		node.data.num_cluster_extractions = cluster_extractions.length;
		const { prompt, system_prompt } = node.data;
		const result = await gpt(
			open_ai_key,
			system_prompt,
			prompt,
			{
				clusters: cluster_extractions.map((x: any) => JSON.stringify(x)).join('\n')
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

interface MergeClusterExtractionData extends ClusterExtractionData {
	// Inherits all properties from ClusterExtractionData
}

type MergeClusterExtractionNode = DGNodeInterface & {
	data: MergeClusterExtractionData;
};

export const merge_cluster_extraction_node: MergeClusterExtractionData = {
	id: 'merge_cluster_extraction',
	data: {
		label: 'Merge Cluster Extraction',
		output: {},
		text: '',
		system_prompt:
			'You are a professional research assistant. You have helped run many public consultations, surveys and citizen assemblies.',
		prompt: merge_extraction_prompt,
		num_cluster_extractions: 0,
		dirty: false,
		compute_type: 'merge_cluster_extraction_v0',
		input_ids: { csv: '', open_ai_key: '' },
		category: categories.wrangling.id,
		icon: 'merge_cluster_extraction_v0'
	},
	position: { x: 0, y: 350 },
	type: 'prompt_v0'
};
