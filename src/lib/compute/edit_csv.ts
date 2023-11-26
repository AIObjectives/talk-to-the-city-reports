export const edit_csv = async (node, inputData) => {
	console.log('Computing', node.data.label, 'with input data', inputData);
	const input = inputData[Object.keys(inputData)[0]];
	if (!input) {
		node.data.dirty = false;
		return;
	}

	for (const [key, value] of Object.entries(node.data.generate)) {
		input.forEach((row) => {
			row[key] = value;
		});
	}

	console.log(node.data);

	node.data.delete.forEach((column) => {
		input.forEach((row) => {
			delete row[column];
		});
	});

	for (const [oldKey, newKey] of Object.entries(node.data.rename)) {
		input.forEach((row) => {
			if (row.hasOwnProperty(oldKey)) {
				row[newKey] = row[oldKey];
				delete row[oldKey];
			}
		});
	}

	node.data.output = input;
	node.data.dirty = false;
	return node.data.output;
};
