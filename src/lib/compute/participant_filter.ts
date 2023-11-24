export const participant_filter = async (node, inputData) => {
	node.data.dirty = false;
	console.log('participant_filter', inputData);
	return inputData;
};
