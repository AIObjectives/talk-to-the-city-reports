export const report = async (node, inputData) => {
	node.data.dirty = false;
	return inputData;
};
