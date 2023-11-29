import papa from 'papaparse';
import { readFileFromGCS } from '$lib/utils';

export const csv = async (node, inputData, context) => {
	console.log('Computing', node.data.label);
	if (node.data.gcs_path) {
		node.data.csv = await readFileFromGCS(node);
	}
	const contents = node.data.csv;
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
		csv: '',
		filename: '',
		size_kb: 0,
		dirty: false,
		gcs_path: '',
		compute_type: 'csv_v0',
		input_ids: {}
	},
	position: { x: 100, y: -50 },
	type: 'csv_v0'
};
