export const report = async (node, inputData, context) => {
	console.log('Computing', node.data.label);
	node.data.dirty = false;
	const input = inputData[Object.keys(inputData)[0]];
	node.data.output = input;
	return input;
};

interface ReportData extends BaseData {
	output: object;
}

type ReportNode = DGNodeInterface & {
	data: ReportData;
};

export const report_node: ReportNode = {
	id: 'report',
	data: {
		label: 'Report',
		output: {},
		dirty: false,
		compute_type: 'report_v0',
		input_ids: {}
	},
	position: { x: 200, y: 850 },
	type: 'report_v0'
};
