import nodes from '$lib/node_register';
import categories from '$lib/node_categories';
import { readFileFromGCS, uploadJSONToGCS } from '$lib/utils';
import gpt from '$lib/gpt';
import _ from 'lodash';
import { format, unwrapFunctionStore } from 'svelte-i18n';

const $__ = unwrapFunctionStore(format);

export default class GPTNode {
	id: string;
	data: GPTData;
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
		let text = inputData[this.data.input_ids.text];
		const open_ai_key = inputData.open_ai_key || inputData[this.data.input_ids.open_ai_key];

		if (_.isPlainObject(text) || _.isArray(text)) {
			text = JSON.stringify(text, null, 2);
		}

		if (!text || text.length == 0) {
			this.data.message = `${$__('missing_input_data')}`;
			this.data.dirty = false;
			return;
		}

		if (!this.data.dirty && this.data.text_length == text.length && this.data.gcs_path) {
			let doc = await readFileFromGCS(this);
			if (typeof doc === 'string') {
				doc = JSON.parse(doc);
			}
			this.data.output = doc;
			this.data.message = `${$__('loaded_from_gcs')}`;
			this.data.dirty = false;
			return this.data.output;
		}

		if (context == 'run' && open_ai_key) {
			this.data.text_length = text.length;
			const { prompt, system_prompt } = this.data;

			info(`${$__('computing')} ${$__(this.data.label)}`);

			let i = 0;
			const interval = setInterval(() => {
				this.data.message = `${$__('computing')} ${$__(this.data.label)} ${'.'.repeat(i % 4)}`;
				info(this.data.message);
				i++;
			}, 5000);

			const todo = new Set([1]);

			const result = await gpt(
				open_ai_key,
				{ text: text },
				prompt,
				system_prompt,
				info,
				error,
				success,
				0,
				1,
				todo
			);

			clearInterval(interval);
			this.data.output = JSON.parse(result);
			this.data.dirty = false;

			this.data.message = `${$__('output_ready')}`;
			success(this.data.message);

			await uploadJSONToGCS(this, this.data.output, slug);
			return this.data.output;
		} else {
			this.data.message = `${$__('missing_input_data')}`;
			this.data.dirty = false;
			return;
		}
	}
}

interface GPTData extends BaseData {
	output: object;
	content: string;
	text_length: number;
	prompt: string;
	system_prompt: string;
}

type GPTNodeInterface = DGNodeInterface & {
	data: GPTData;
};

export let gpt_node_data: GPTNodeInterface = {
	id: 'gpt',
	data: {
		label: 'GPT',
		output: {},
		prompt: 'Please write a first hand account of living conditions in any city of your choice.',
		system_prompt: 'You are a helpful assistant.',
		compute_type: 'gpt_v0',
		text_length: 0,
		dirty: false,
		input_ids: { open_ai_key: '', text: '' },
		category: categories.ml.id,
		icon: 'gpt_v0'
	},
	position: { x: 0, y: 0 },
	type: 'gpt_v0'
};

export let gpt_node = new GPTNode(gpt_node_data);
nodes.register(GPTNode, gpt_node);
