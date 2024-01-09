import nodes from '$lib/node_register';
import categories from '$lib/node_categories';
import { readFileFromGCS, uploadJSONToGCS } from '$lib/utils';
import {
	argument_extraction_prompt_v1,
	argument_extraction_system_prompt,
	argument_extraction_prompt_v1_suffix
} from '$lib/prompts';
import gpt from '$lib/gpt';
import _ from 'lodash';
import { format, unwrapFunctionStore } from 'svelte-i18n';

const $__ = unwrapFunctionStore(format);

export default class ArgumentExtractionNodeV1 {
	id: string;
	data: ArgumentExtractionData;
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
		const { prompt, system_prompt, prompt_suffix } = this.data;
		const csv = inputData.csv || inputData[this.data.input_ids.csv];
		const open_ai_key = inputData.open_ai_key || inputData[this.data.input_ids.open_ai_key];
		const cluster_extraction =
			inputData.cluster_extraction || inputData[this.data.input_ids.cluster_extraction];

		if (!csv || csv.length == 0 || !cluster_extraction) {
			this.data.message = `${$__('missing_input_data')}`;
			this.data.dirty = false;
			return;
		}

		if (!this.data.dirty && this.data.csv_length == csv.length && this.data.gcs_path) {
			let doc = await readFileFromGCS(this);
			if (typeof doc === 'string') {
				doc = JSON.parse(doc);
			}
			const numClaims = _.reduce(doc, (sum, value) => sum + value.claims.length, 0);
			this.data.message = `${$__('loaded_from_gcs')}. ${$__('comments')}: ${
				_.keys(doc).length
			} ${$__('claims')}: ${numClaims}.`;
			this.data.output = doc;
			this.data.dirty = false;
			return this.data.output;
		}

		if (context == 'run' && open_ai_key && (prompt || system_prompt)) {
			this.data.output = {};
			const clusters = JSON.stringify(cluster_extraction);

			const todo = new Set(_.range(0, csv.length));

			let gptPromises = [];
			for (let i = 0; i < csv.length; i++) {
				gptPromises.push(
					(async () => {
						try {
							const comment = csv[i]['comment-body'];
							const interview = csv[i]['interview'];
							const replacements = {
								comment: comment,
								clusters: clusters
							};
							const response = await gpt(
								open_ai_key,
								replacements,
								prompt + '\n' + prompt_suffix,
								system_prompt,
								info,
								error,
								success,
								i,
								csv.length,
								todo
							);
							return { id: csv[i]['comment-id'], ...JSON.parse(response), comment, interview };
						} catch (err) {
							error(err.message);
							// Return null or handle the error as desired
							return null;
						}
					})()
				);
			}
			info(`${$__('calling_openai')}: [${csv.length}]`);
			let startTime = performance.now();
			console.time($__('calling_openai'));
			const results = await Promise.all(gptPromises);
			console.timeEnd($__('calling_openai'));
			let endTime = performance.now();
			let timeTaken = endTime - startTime;
			success(`${$__('calling_openai')}: ${Math.floor(timeTaken / 1000)} ${$__('seconds')}`);

			results.forEach((result) => {
				if (result) this.data.output[result.id] = result;
			});

			const numClaims = _.reduce(this.data.output, (sum, value) => sum + value.claims.length, 0);
			this.data.message = `${$__('comments')}: ${_.keys(this.data.output).length} ${$__(
				'claims'
			)}: ${numClaims}.`;

			this.data.csv_length = csv.length;

			this.data.dirty = false;
			await uploadJSONToGCS(this, this.data.output, slug);
			return this.data.output;
		} else {
			this.data.message = `${$__('missing_input_data')}`;
			this.data.dirty = false;
			return;
		}
	}
}

interface ArgumentExtractionData extends ClusterExtractionData {
	// Inherits all properties from ClusterExtractionData
}

type ArgumentExtractionNodeInterface = DGNodeInterface & {
	data: ArgumentExtractionData;
};

export let argument_extraction_node_data_v1: ArgumentExtractionNodeInterface = {
	id: 'argument_extraction',
	data: {
		label: 'argument_extraction',
		output: {},
		text: '',
		system_prompt: argument_extraction_system_prompt,
		prompt: argument_extraction_prompt_v1,
		prompt_suffix: argument_extraction_prompt_v1_suffix,
		csv_length: 0,
		dirty: false,
		compute_type: 'argument_extraction_v1',
		input_ids: { open_ai_key: '', csv: '', cluster_extraction: '' },
		category: categories.ml.id,
		icon: 'argument_extraction_v0'
	},
	position: { x: 0, y: 0 },
	type: 'prompt_v0'
};

export let argument_extraction_node_v1 = new ArgumentExtractionNodeV1(
	argument_extraction_node_data_v1
);

nodes.register(ArgumentExtractionNodeV1, argument_extraction_node_data_v1);
