import nodes from '$lib/node_register';
import categories from '$lib/node_categories';
import { readFileFromGCS, uploadJSONToGCS } from '$lib/utils';
import { cluster_extraction_prompt, cluster_extraction_system_prompt } from '$lib/prompts';
import { format, unwrapFunctionStore } from 'svelte-i18n';
import _ from 'lodash';

const $__ = unwrapFunctionStore(format);

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
	info($__('calling_openai'));
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

export default class ClusterExtractionNode {
	id: string;
	data: ClusterExtractionData;
	position: { x: number; y: number };
	type: string;

	constructor(node_data) {
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
		const csv = inputData.csv || inputData[this.data.input_ids.csv];
		const open_ai_key = inputData.open_ai_key || inputData[this.data.input_ids.open_ai_key];

		if (!csv || csv.length == 0 || !(this.data.prompt || this.data.system_prompt)) {
			this.data.dirty = false;
			return;
		}

		if (!this.data.dirty && this.data.csv_length == csv.length && this.data.gcs_path) {
			let doc = await readFileFromGCS(this);
			if (typeof doc === 'string') {
				doc = JSON.parse(doc);
			}
			this.data.output = doc;
			this.data.dirty = false;
			return this.data.output;
		}

		if (context == 'run' && open_ai_key && csv && csv.length > 0) {
			info(`${$__('computing')} ${$__(this.data.label)}`);
			this.data.csv_length = csv.length;
			const { prompt, system_prompt } = this.data;
			let i = 0;
			const interval = setInterval(() => {
				this.data.message = `${$__('computing')} ${$__(this.data.label)} ${'.'.repeat(i % 4)}`;
				info(this.data.message);
				i++;
			}, 5000);
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
			clearInterval(interval);
			this.data.output = JSON.parse(result);
			await uploadJSONToGCS(this, this.data.output, slug);
			this.data.dirty = false;
			this.data.message = `${$__('done_computing')} ${$__(this.data.label)}`;
			success(this.data.message);
			return this.data.output;
		}
	}
}

interface ClusterExtractionData extends BaseData {
	output: object;
	text: string;
	system_prompt: string;
	prompt: string;
	csv_length: number;
}

type ClusterExtractionNodeInterface = DGNodeInterface & {
	data: ClusterExtractionData;
};

export let cluster_extraction_node_data: ClusterExtractionNodeInterface = {
	id: 'cluster_extraction',
	data: {
		label: 'cluster_extraction',
		output: {},
		text: '',
		system_prompt: cluster_extraction_system_prompt,
		prompt: cluster_extraction_prompt,
		csv_length: 0,
		dirty: false,
		compute_type: 'cluster_extraction_v0',
		input_ids: { open_ai_key: '', csv: '' },
		category: categories.llm.id,
		icon: 'cluster_extraction_v0',
		show_in_ui: true
	},
	position: { x: 0, y: 0 },
	type: 'prompt_v0'
};

export let cluster_extraction_node = new ClusterExtractionNode(cluster_extraction_node_data);

nodes.register(ClusterExtractionNode, cluster_extraction_node_data);
