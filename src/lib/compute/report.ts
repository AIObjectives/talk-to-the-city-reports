export const report = async (node, inputData) => {
	node.data.output = inputData;
	node.data.dirty = false;
	return node.data.output;
};
