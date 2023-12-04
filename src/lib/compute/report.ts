import categories from '$lib/node_categories';
export const report = async (
	node: ReportNode,
	inputData: object,
	context: string,
	info: (arg: string) => void,
	error: (arg: string) => void,
	success: (arg: string) => void,
	slug: string
) => {
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
		input_ids: {},
		category: categories.display.id,
		icon: 'report_v0'
	},
	position: { x: 0, y: 0 },
	type: 'report_v0'
};
