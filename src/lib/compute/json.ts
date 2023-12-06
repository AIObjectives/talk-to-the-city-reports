import nodes from '$lib/node_register';
import categories from '$lib/node_categories';
import { readFileFromGCS } from '$lib/utils';

interface BaseData {}

interface JSONData extends BaseData {
	json: any;
	filename: string;
	size_kb: number;
	gcs_path: string;
}

class JSONNode {
	id: string;
	data: JSONData;
	position: { x: number; y: number };
	type: string;

	constructor(node_data) {
		const { id, data, position, type } = node_data;
		this.id = id;
		this.data = data;
		this.position = position;
		this.type = type;
	}

	async compute() {
		if (!this.data.dirty && this.data.output && this.data.output.length > 0) {
			return this.data.output;
		}

		let contents;
		if (this.data.gcs_path) {
			contents = await readFileFromGCS(this);
			this.data.output = JSON.parse(contents);
		}

		this.data.dirty = false;
		this.data.json = null;
		return this.data.output;
	}
}

export default JSONNode;

type JSONNodeInterface = DGNodeInterface & {
	data: JSONData;
};

export let json_node_data: JSONNodeInterface = {
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

export let json_node = new JSONNode(json_node_data);

nodes.register(JSONNode, json_node_data);
