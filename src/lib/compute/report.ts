export const report = async (node, inputData) => {
	console.log(inputData);
	node.data.dirty = false;
	return inputData;
};
