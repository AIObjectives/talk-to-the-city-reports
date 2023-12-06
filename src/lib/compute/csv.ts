import nodes from '$lib/node_register';
import categories from '$lib/node_categories';
import papa from 'papaparse';
import { readFileFromGCS } from '$lib/utils';

interface BaseData {}

interface CSVData extends BaseData {
	csv: string;
	filename: string;
	size_kb: number;
	gcs_path: string;
}

export default class CSVNode {
	id: string;
	data: CSVData;
	position: { x: number; y: number };
	type: string;

	constructor(node_data) {
		const { id, data, position, type } = node_data;
		this.id = id;
		this.data = data;
		this.position = position;
		this.type = type;
	}

	// these are the arguments that are passed to the compute function
	async compute(
		node: CSVNodeInterface,
		inputData: object,
		context: string,
		info: (arg: string) => void,
		error: (arg: string) => void,
		success: (arg: string) => void,
		slug: string,
		Cookies: any
	) {
		if (!this.data.dirty && this.data.output && this.data.output.length > 0) {
			return this.data.output;
		}

		let contents;
		if (this.data.gcs_path) {
			contents = await readFileFromGCS(this);
			const parsedData = papa.parse(contents, { header: true }).data;
			this.data.output = this.filterValidRows(parsedData);
		}

		this.data.dirty = false;
		this.data.csv = null;
		return this.data.output;
	}

	filterValidRows(parsedData: any[]) {
		const validRows = [];
		for (const row of parsedData) {
			if (this.isValidRow(row)) {
				validRows.push(row);
			}
		}
		return validRows;
	}

	isValidRow(row: object) {
		for (const column in row) {
			row[column] = row[column].trim();
		}
		let allEmpty = true;
		for (const column in row) {
			if (row[column] !== '') {
				allEmpty = false;
				break;
			}
		}
		return !allEmpty;
	}
}

type CSVNodeInterface = DGNodeInterface & {
	data: CSVData;
};

// This data matters, as it is used for the tests
// please make sure it remains available
export let csv_node_data: CSVNodeInterface = {
	id: 'csv',
	data: {
		label: 'CSV',
		filename: '',
		size_kb: 0,
		dirty: false,
		gcs_path: '',
		compute_type: 'csv_v0',
		input_ids: {},
		category: categories.input.id,
		icon: 'csv_v0'
	},
	position: { x: 0, y: 0 },
	type: 'csv_v0'
};

// This is the node itself. It is created here as other parts of the
// code imports it for use in the system. Please keep it as is.
export let csv_node = new CSVNode(csv_node_data);

nodes.register(CSVNode, csv_node_data);
