import categories from '$lib/node_categories';

function keyIsValid(key) {
	return key && key.length == 51 && key.slice(0, 3) == 'sk-';
}

export const open_ai_key = async (
	node: OpenAIKeyNode,
	inputData: object,
	context: string,
	info: (arg: string) => void,
	error: (arg: string) => void,
	success: (arg: string) => void,
	slug: string,
	Cookies: any
) => {
	let ui_key = node.data.text;
	let ui_key_is_valid = keyIsValid(ui_key);
	if (ui_key && ui_key_is_valid) {
		Cookies.set('open_ai_key', ui_key);
		node.data.text = 'sk-...(key hidden)';
		node.data.dirty = false;
		return ui_key;
	}
	if (ui_key && !ui_key_is_valid) {
		node.data.text = 'Invalid key';
		node.data.dirty = false;
	}
	let local_key = Cookies.get('open_ai_key');
	let local_key_is_valid = keyIsValid(local_key);
	if (local_key && local_key_is_valid) {
		node.data.text = 'sk-...(key hidden)';
		node.data.dirty = false;
		return local_key;
	}
	node.data.text = 'Invalid key';
};

interface OpenAIKeyData extends BaseData {
	text: string;
}

type OpenAIKeyNode = DGNodeInterface & {
	data: OpenAIKeyData;
};

export const open_ai_key_node: OpenAIKeyNode = {
	id: 'open_ai_key',
	data: {
		label: 'OpenAI Key',
		text: 'sk-...',
		dirty: false,
		compute_type: 'open_ai_key_v0',
		input_ids: {},
		category: categories.llm.id,
		icon: 'open_ai_key_v0'
	},
	position: { x: 0, y: 0 },
	type: 'text_input_v0'
};
