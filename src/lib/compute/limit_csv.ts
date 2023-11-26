export const limit_csv = async (node: LimitCSVNode, inputData: object) => {
	const input: [object] = inputData[Object.keys(inputData)[0]];
	node.data.dirty = false;

	if (input && input.length) {
		return input.slice(0, node.data.number);
	}
};
