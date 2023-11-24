export const report = async (node, inputData) => {
	console.log('Computing', node.data.label);
	console.log('Input', inputData);
	node.data.dirty = false;
	const input = inputData[Object.keys(inputData)[0]];
	console.log(input);
	node.data.output = input;
	return input;
};
