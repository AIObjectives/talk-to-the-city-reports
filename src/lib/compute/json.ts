import categories from '$lib/node_categories';
import { readFileFromGCS } from '$lib/utils';

export const json = async (
	node: JSONNode,
	inputData: object,
	context: string,
	info: (arg: string) => void,
	error: (arg: string) => void,
	success: (arg: string) => void,
	slug: string
) => {
	let contents;
	if (node.data.gcs_path) {
		contents = await readFileFromGCS(node);
		if (typeof contents == 'string') {
			contents = JSON.parse(contents);
		}
	}
	node.data.output = contents;
	node.data.dirty = false;
	return node.data.output;
};

interface JSONData extends BaseData {
	filename: string;
	size_kb: number;
	gcs_path: string;
}

type JSONNode = DGNodeInterface & {
	data: JSONData;
};

export let json_node: JSONNode = {
	id: 'json',
	data: {
		label: 'JSON',
		filename: '',
		size_kb: 0,
		dirty: false,
		gcs_path: '',
		compute_type: 'json_v0',
		input_ids: {},
		category: categories.input.id,
		icon: 'json_v0'
	},
	position: { x: 0, y: 0 },
	type: 'json_v0'
};
