import Cookies from 'js-cookie';

function keyIsValid(key) {
	return key.length == 51 && key.slice(0, 3) == 'sk-';
}

export const open_ai_key = async (node, inputData) => {
	let ui_key = node.data.text;
	let ui_key_is_valid = keyIsValid(ui_key);
	if (ui_key && ui_key_is_valid) {
		Cookies.set('open_ai_key', ui_key);
		return ui_key;
	}
	if (ui_key && !ui_key_is_valid) {
		return;
	}
	let local_key = Cookies.get('open_ai_key');
	if (local_key && keyIsValid(local_key)) {
		return local_key;
	}
};
