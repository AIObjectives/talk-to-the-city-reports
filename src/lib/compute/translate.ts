import openai from 'openai';

async function oai_translate(apiKey, text, target_language, info, error, success) {
	info('Translating: ' + text);
	const OpenAI = new openai({ apiKey, dangerouslyAllowBrowser: true });
	const res = await OpenAI.chat.completions.create({
		messages: [
			{
				role: 'system',
				content:
					'You are a professional translator, that translates the text given by the user to ' +
					target_language +
					'. You provide the translation result, and say nothing else.'
			},
			{ role: 'user', content: text }
		],
		model: 'gpt-4',
		temperature: 0.1
	});
	return res.choices[0].message.content;
}

export const translate = async (node, inputData, info, error, success) => {
	console.log('Computing translate');
	const open_ai_key = inputData.open_ai_key || inputData[node.data.input_ids.open_ai_key];
	const data = inputData.data || inputData[node.data.input_ids.data];
	const target_language = node.data.target_language;
	const keys = node.data.keys;

	if (!node.data.dirty) {
		console.log('Not dirty, using cached translations');
		return node.data.output.map((translatedItem, index) => {
			return { ...data[index], ...translatedItem };
		});
	}

	let promises = [];
	for (let i = 0; i < data.length; i++) {
		for (let j = 0; j < keys.length; j++) {
			const key = keys[j];
			const text = data[i][key];
			promises.push(oai_translate(open_ai_key, text, target_language, info, error, success));
		}
	}

	const allTranslations = await Promise.all(promises);
	let translations = [];
	let counter = 0;
	for (let i = 0; i < data.length; i++) {
		let translationItem = {};
		for (let j = 0; j < keys.length; j++) {
			const key = keys[j];
			translationItem[key] = allTranslations[counter++];
			console.log('Translation: ' + translationItem[key]);
		}
		translations.push(translationItem);
	}

	node.data.dirty = false;
	node.data.output = translations;
	return translations.map((translatedItem, index) => {
		return { ...data[index], ...translatedItem };
	});
};
