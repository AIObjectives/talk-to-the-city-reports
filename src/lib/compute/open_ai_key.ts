export const open_ai_key = async (node, inputData) => {
	if (!node.data.dirty) {
		console.log('OpenAI Key data is not dirty. Returning.');
		return node.data.text;
	}
	console.log('Computing', node.data.label, 'with input data', inputData);
	let key = node.data.text;
	if (key.length == 51 && key.slice(0, 3) == 'sk-') {
		node.data.dirty = false;
		return node.data.text;
	}
};
