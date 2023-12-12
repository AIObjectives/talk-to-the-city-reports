import nodes from '$lib/node_register';
import { readFileFromGCS, uploadJSONToGCS } from '$lib/utils';
import { merge_extraction_prompt } from '$lib/prompts';
import categories from '$lib/node_categories';

export default class MergeClusterExtractionNode {
	id: string;
	data: MergeClusterExtractionData;
	position: { x: number; y: number };
	type: string;

	constructor(node_data: MergeClusterExtractionNodeInterface) {
		const { id, data, position, type } = node_data;
		this.id = id;
		this.data = data;
		this.position = position;
		this.type = type;
	}

	async compute(
		inputData: object,
		context: string,
		info: (arg: string) => void,
		error: (arg: string) => void,
		success: (arg: string) => void,
		slug: string,
		Cookies: any
	) {
		const csv_key = this.data.input_ids.csv;
		const open_ai_key_key = this.data.input_ids.open_ai_key;
		const keys = Object.keys(inputData);
		const cluster_extraction_keys = keys.filter((x) => x != csv_key && x != open_ai_key_key);
		const cluster_extractions = cluster_extraction_keys.map((x) => inputData[x]);
		const open_ai_key = inputData.open_ai_key || inputData[this.data.input_ids.open_ai_key];

		if (
			!cluster_extractions ||
			cluster_extractions.length == 0 ||
			!(this.data.prompt || this.data.system_prompt)
		) {
			this.data.dirty = false;
			return;
		}

		if (
			!this.data.dirty &&
			this.data.num_cluster_extractions == cluster_extractions.length &&
			this.data.gcs_path
		) {
			let doc = await readFileFromGCS(this);
			if (typeof doc === 'string') {
				doc = JSON.parse(doc);
			}
			this.data.output = doc;
			this.data.dirty = false;
			return this.data.output;
		}

		if (context == 'run' && open_ai_key && cluster_extractions && cluster_extractions.length > 0) {
			info('Computing ' + this.data.label);
			this.data.num_cluster_extractions = cluster_extractions.length;
			const { prompt, system_prompt } = this.data;
			const result = await this.gpt(
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
			this.data.output = JSON.parse(result);
			await uploadJSONToGCS(this, this.data.output, slug);
			this.data.dirty = false;
			success('Done computing ' + this.data.label);
			return this.data.output;
		}
	}

	private async gpt(
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
}

interface MergeClusterExtractionData extends ClusterExtractionData {
	// Inherits all properties from ClusterExtractionData
}

type MergeClusterExtractionNodeInterface = DGNodeInterface & {
	data: MergeClusterExtractionData;
};

export let merge_cluster_extraction_node_data: MergeClusterExtractionNodeInterface = {
	id: 'merge_cluster_extraction',
	data: {
		label: 'merge_cluster_extraction',
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
		icon: 'merge_cluster_extraction_v0',
		show_in_ui: false
	},
	position: { x: 0, y: 0 },
	type: 'prompt_v0'
};

export let merge_cluster_extraction_node = new MergeClusterExtractionNode(
	merge_cluster_extraction_node_data
);

nodes.register(MergeClusterExtractionNode, merge_cluster_extraction_node_data);
