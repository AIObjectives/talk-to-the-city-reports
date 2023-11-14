import papa from 'papaparse';

const requiredColumns = ['comment-id', 'comment-body'];

export const csv = async (node, inputData) => {
	if (!node.data.dirty) {
		console.log('CSV data is not dirty. Returning.');
		return node.data.output;
	}
	console.log('Computing', node.data.label, 'with input data', inputData);
	const contents = node.data.csv;
	const lines = contents.split('\n');
	const columns = lines[0].split(',').map((x: string) => x.trim());
	const missingColumns = requiredColumns.filter((x: string) => !columns.includes(x));
	if (missingColumns.length) {
		console.log(`Missing required columns: ${missingColumns.join(', ')}`);
	} else {
		node.data.output = papa.parse(contents, { header: true }).data;
		node.data.dirty = false;
		console.log(node.data.output);
		return node.data.output;
	}
};
