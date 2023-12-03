import { readFileFromGCS, uploadDataToGCS } from '$lib/utils';
import { cluster_extraction_prompt, cluster_extraction_system_prompt } from '$lib/prompts';

async function gpt(
	apiKey: string,
	systemPrompt: string,
	promptTemplate: string,
	replacements: { [key: string]: string },
	info,
	error,
	success
) {
	let vitest = import.meta.env.VITEST == 'true';
	let openai = (await import(vitest ? '$lib/mock_open_ai' : 'openai')).default;

	let prompt = promptTemplate;
	for (const [key, value] of Object.entries(replacements)) {
		prompt = prompt.replace(`{${key}}`, value);
	}
	const OpenAI = new openai({ apiKey, dangerouslyAllowBrowser: true });
	info('Calling OpenAI');
	try {
		const messages = [
			{ role: 'system', content: systemPrompt },
			{ role: 'user', content: prompt }
		];
		const res = await OpenAI.chat.completions.create({
			messages: messages,
			model: 'gpt-4-1106-preview',
			response_format: { type: 'json_object' },
			temperature: 0.1
		});
		const resp = res.choices[0].message.content!;
		return resp;
	} catch (e) {
		error('Error calling OpenAI: ' + e.error.message);
		console.log('Error calling openai...', e.error.message);
	}
}

export const cluster_extraction = async (
	node: ClusterExtractionNode,
	inputData: object,
	context: string,
	info: (arg: string) => void,
	error: (arg: string) => void,
	success: (arg: string) => void,
	slug: string
) => {
	const csv = inputData.csv || inputData[node.data.input_ids.csv];
	const open_ai_key = inputData.open_ai_key || inputData[node.data.input_ids.open_ai_key];

	if (!csv || csv.length == 0 || !(node.data.prompt || node.data.system_prompt)) {
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
		return node.data.output;
	}

	if (context == 'run' && open_ai_key && csv && csv.length > 0 && open_ai_key) {
		info('Computing ' + node.data.label);
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
		system_prompt: cluster_extraction_prompt,
		prompt: cluster_extraction_system_prompt,
		csv_length: 0,
		dirty: false,
		compute_type: 'cluster_extraction_v0',
		input_ids: { open_ai_key: '', csv: '' }
	},
	position: { x: 100, y: 100 },
	type: 'prompt_v0'
};
