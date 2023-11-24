export const limit_csv = async (node: LimitCSVNode, inputData: object) => {
	const input: [object] = inputData[Object.keys(inputData)[0]];

	if (input && input.length) {
		node.data.dirty = false;
		return input.slice(0, node.data.number);
	}
};
