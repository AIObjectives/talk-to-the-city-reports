import papa from 'papaparse';

const requiredColumns = ['comment-id', 'comment-body'];

export const csv = async (node, inputData) => {
	if (!node.data.dirty) {
		console.log('CSV data is not dirty. Returning.');
		return node.data.output;
	}
	console.log('Computing', node.data.label, 'with input data', inputData);
	const contents = node.data.csv;
	const parsedData = papa.parse(contents, { header: true }).data;

	const validRows = [];

	for (const row of parsedData) {
		let isValidRow = true;

		// trim all values
		for (const column in row) {
			row[column] = row[column].trim();
		}

		for (const column of requiredColumns) {
			if (!row[column] || row[column].trim() === '') {
				isValidRow = false;
				break;
			}
		}

		if (isValidRow) {
			validRows.push(row);
		}
	}

	node.data.output = validRows;
	node.data.dirty = false;
	// clean up to save space
	node.data.csv = null;
	console.log(node.data.output);
	return node.data.output;
};
