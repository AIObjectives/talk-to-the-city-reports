import openai from 'openai';
import { readFileFromGCS, uploadDataToGCS } from '$lib/utils';

async function oai_translate(apiKey, text, target_language, info) {
	console.log('Translating: ' + text);
	info('Translating: ' + text);
	const OpenAI = new openai({ apiKey, dangerouslyAllowBrowser: true });
	const response = await OpenAI.chat.completions.create({
		messages: [
			{
				role: 'system',
				content: 'Translate the following text to ' + target_language + '.'
			},
			{ role: 'user', content: text }
		],
		model: 'gpt-4',
		temperature: 0.1
	});
	return response.choices[0].message.content;
}

async function processInChunks(array, handler, chunkSize) {
	for (let i = 0; i < array.length; i += chunkSize) {
		const chunk = array.slice(i, i + chunkSize);
		await Promise.all(chunk.map((item) => handler(item)));
	}
}

export const translate = async (node, inputData, info, error, success, slug) => {
	console.log('Initiating translation process');
	const open_ai_key = inputData.open_ai_key || inputData[node.data.input_ids.open_ai_key];
	const data = inputData.data || inputData[node.data.input_ids.data];
	const target_language = node.data.target_language;
	const keys = node.data.keys;

	if (!data || !target_language || !keys) {
		node.data.dirty = false;
		return;
	}

	console.log('data', data);
	console.log('data', data.length);

	if (node.data.gcs_path) {
		let storedData = await readFileFromGCS(node);
		if (typeof storedData === 'string') storedData = JSON.parse(storedData);
		storedData = storedData.slice(0, data.length);
		node.data.output = storedData;
	}

	console.log('node.data.output', node.data.output);
	console.log('node.data.output', node.data.output.length);
	console.log('node.data.dirty', node.data.dirty);

	if (!node.data.dirty && node.data.output.length >= data.length) {
		console.log('Using cached translations');
		console.log(data);
		return node.data.output.map((translatedItem, index) => {
			return { ...data[index], ...translatedItem };
		});
	}

	const translateHandler = (text) => oai_translate(open_ai_key, text, target_language, info);
	let translations = [];

	for (let i = 0; i < data.length; i++) {
		let translationItem = {};
		await processInChunks(
			keys,
			async (key) => {
				translationItem[key] = await translateHandler(data[i][key]);
			},
			5
		);
		translations.push(translationItem);
	}

	node.data.dirty = false;
	node.data.output = translations;
	await uploadDataToGCS(node, translations, slug + '/translate');

	console.log('Translation process completed');
	return translations.map((translatedItem, index) => {
		return { ...data[index], ...translatedItem };
	});
};
