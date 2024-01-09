import nodes from '$lib/node_register';
import categories from '$lib/node_categories';
import _ from 'lodash';
import { format, unwrapFunctionStore } from 'svelte-i18n';
import type { DGNodeInterface, BaseData } from '$lib/node_data_types';

const $__ = unwrapFunctionStore(format);

export default class ReportNode {
	id: string;
	data: ReportData;
	position: { x: number; y: number };
	type: string;

	constructor(node_data: ReportNodeInterface) {
		const { id, data, position, type } = node_data;
		this.id = id;
		this.data = data;
		this.position = position;
		this.type = type;
	}

	async compute(
		inputData: Record<string, any>,
		context: string,
		info: (arg: string) => void,
		error: (arg: string) => void,
		success: (arg: string) => void,
		slug: string,
		Cookies: any
	) {
		this.data.dirty = false;
		const output_ids = this.data.output_ids;
		const output = this.data.output;
		this.data.output[output_ids.merge] = inputData[this.data.input_ids.merge];
		this.data.output[output_ids.csv] = inputData[this.data.input_ids.csv];
		if (output.merge?.topics.length > 0 && output.csv?.length > 0) {
			this.data.message = `
		${$__(`clusters`)}: ${output.merge?.topics.length}<br/>
		${$__(`csv`)}: ${output.csv?.length}`;
		} else {
			this.data.message = '';
		}

		return this.data.output;
	}
}

interface ReportData extends BaseData {
	output: Record<string, any>;
	output_ids: Record<string, string>;
}

type ReportNodeInterface = DGNodeInterface & {
	data: ReportData;
};

export let report_node_data: ReportNodeInterface = {
	id: 'report_v1',
	data: {
		label: 'report v1',
		output: {},
		dirty: false,
		compute_type: 'report_v1',
		input_ids: { merge: '', csv: '' },
		output_ids: { merge: 'merge', csv: 'csv' },
		category: categories.display.id,
		icon: 'report_v0',
		show_in_ui: false,
		message: ''
	},
	position: { x: 0, y: 0 },
	type: 'default_v0'
};

export let report_node_v1 = new ReportNode(report_node_data);

nodes.register(ReportNode, report_node_data);
