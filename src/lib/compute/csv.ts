import papa from 'papaparse';
import { readFileFromGCS } from '$lib/utils';

export const csv = async (node, inputData) => {
	console.log('Computing', node.data.label);
	if (node.data.gcs_path) {
		node.data.csv = await readFileFromGCS(node);
		console.log('Read CSV from GCS', node.data.csv);
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
	console.log(node.data.output);
	return node.data.output;
};
