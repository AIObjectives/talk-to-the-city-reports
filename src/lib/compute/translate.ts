import categories from '$lib/node_categories';
import { readFileFromGCS, uploadDataToGCS } from '$lib/utils';

async function oai_translate(apiKey, text, target_language, info) {
	let vitest = import.meta.env.VITEST == 'true';
	let openai = (await import(vitest ? '$lib/mock_open_ai' : 'openai')).default;
	info('Translating: ' + text);
	const OpenAI = new openai({ apiKey, dangerouslyAllowBrowser: true });
	try {
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
	} catch (error) {
		console.error('Error translating text: ', error);
		return null; // return null when an error occurs
	}
}

async function processInChunks(array, handler, chunkSize) {
	for (let i = 0; i < array.length; i += chunkSize) {
		const chunk = array.slice(i, i + chunkSize);
		await Promise.all(chunk.map((item) => handler(item)));
	}
}

export const translate = async (
	node: TranslateNode,
	inputData: object,
	context: string,
	info: (arg: string) => void,
	error: (arg: string) => void,
	success: (arg: string) => void,
	slug: string
) => {
	const open_ai_key = inputData.open_ai_key || inputData[node.data.input_ids.open_ai_key];
	const data = inputData.data || inputData[node.data.input_ids.data];
	const target_language = node.data.target_language;
	const keys = node.data.keys;

	if (!data || !target_language || !keys) {
		node.data.dirty = false;
		return;
	}

	if (node.data.gcs_path) {
		let storedData = await readFileFromGCS(node);
		if (typeof storedData === 'string') storedData = JSON.parse(storedData);
		storedData = storedData.slice(0, data.length);
		node.data.output = storedData;
	}

	if (!node.data.dirty && node.data.output && node.data.output.length >= data.length) {
		return node.data.output.map((translatedItem, index) => {
			return { ...data[index], ...translatedItem };
		});
	}

	if (context == 'run') {
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

		return translations.map((translatedItem, index) => {
			return { ...data[index], ...translatedItem };
		});
	}
};

interface TranslateData extends BaseData {
	target_language: string;
	gcs_path: string;
	keys: string[];
}

type TranslateNode = DGNodeInterface & {
	data: TranslateData;
};

export const translate_node: TranslateNode = {
	id: 'translate',
	data: {
		label: 'Translate',
		target_language: 'English',
		keys: [],
		dirty: false,
		gcs_path: '',
		compute_type: 'translate_v0',
		input_ids: { open_ai_key: '', data: '' },
		category: categories.llm.id,
		icon: 'translate_v0'
	},
	position: { x: 0, y: 0 },
	type: 'translate_v0'
};
