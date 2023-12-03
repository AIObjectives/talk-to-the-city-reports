import categories from '$lib/node_categories';

import papa from 'papaparse';
import { readFileFromGCS } from '$lib/utils';

export const csv = async (
	node: CSVNode,
	inputData: object,
	context: string,
	info: (arg: string) => void,
	error: (arg: string) => void,
	success: (arg: string) => void,
	slug: string
) => {
	if (!node.data.dirty && node.data.output && node.data.output.length > 0) {
		return node.data.output;
	}
	let contents;
	if (node.data.gcs_path) {
		contents = await readFileFromGCS(node);
		const parsedData = papa.parse(contents, { header: true }).data;
		const validRows = [];
		for (const row of parsedData) {
			let isValidRow = true;
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
			isValidRow = !allEmpty;
			if (isValidRow) {
				validRows.push(row);
			}
		}
		node.data.output = validRows;
	}
	node.data.dirty = false;
	node.data.csv = null;
	return node.data.output;
};

interface CSVData extends BaseData {
	csv: string;
	filename: string;
	size_kb: number;
	gcs_path: string;
}

type CSVNode = DGNodeInterface & {
	data: CSVData;
};

export let csv_node: CSVNode = {
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
	position: { x: 100, y: -50 },
	type: 'csv_v0'
};
