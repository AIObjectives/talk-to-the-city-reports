import Cookies from 'js-cookie';

function keyIsValid(key) {
	return key && key.length == 51 && key.slice(0, 3) == 'sk-';
}

export const open_ai_key = async (node, inputData) => {
	console.log('Computing open_ai_key');
	let ui_key = node.data.text;
	let ui_key_is_valid = keyIsValid(ui_key);
	if (ui_key && ui_key_is_valid) {
		Cookies.set('open_ai_key', ui_key);
		node.data.text = 'sk-...(key hidden)';
		node.data.dirty = false;
		return ui_key;
	}
	let local_key = Cookies.get('open_ai_key');
	let local_key_is_valid = keyIsValid(local_key);
	if (!(local_key && local_key_is_valid)) {
		if (ui_key && !ui_key_is_valid) {
			node.data.text = 'Invalid key';
			node.data.dirty = false;
			return;
		}
	}
	if (local_key && local_key_is_valid) {
		node.data.text = 'sk-...(key hidden)';
		node.data.dirty = false;
		return local_key;
	}
	node.data.text = local_key.slice(0, 3) + 'sk-...';
};
