import nodes from '$lib/node_register';
import { readFileFromGCS, uploadJSONToGCS } from '$lib/utils';

import categories from '$lib/node_categories';

interface TranslateData extends BaseData {
	target_language: string;
	gcs_path: string;
	keys: string[];
}

export default class TranslateNode {
	id: string;
	data: TranslateData;
	position: { x: number; y: number };
	type: string;

	constructor(node_data) {
		const { id, data, position, type } = node_data;
		this.id = id;
		this.data = data;
		this.position = position;
		this.type = type;
	}

	async compute(inputData: object, context: string, info: (arg: string) => void) {
		const open_ai_key = inputData.open_ai_key || inputData[this.data.input_ids.open_ai_key];
		const data = inputData.data || inputData[this.data.input_ids.data];
		const target_language = this.data.target_language;
		const keys = this.data.keys;

		console.log(data, target_language, keys);

		if (!data || !target_language || !keys) {
			this.data.dirty = false;
			return;
		}

		if (this.data.gcs_path) {
			let storedData = await readFileFromGCS(this);
			if (typeof storedData === 'string') storedData = JSON.parse(storedData);
			storedData = storedData.slice(0, data.length);
			this.data.output = storedData;
		}

		if (!this.data.dirty && this.data.output && this.data.output.length >= data.length) {
			return this.data.output.map((translatedItem, index) => {
				return { ...data[index], ...translatedItem };
			});
		}

		if (context == 'run') {
			const translateHandler = async (text) => {
				let vitest = import.meta.env.VITEST == 'true';
				let openai = (await import(vitest ? '$lib/mock_open_ai' : 'openai')).default;
				info('Translating: ' + text);
				const OpenAI = new openai({ apiKey: open_ai_key, dangerouslyAllowBrowser: true });
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
					return null;
				}
			};

			let translations = [];

			for (let i = 0; i < data.length; i++) {
				let translationItem = {};
				for (const key of keys) {
					translationItem[key] = await translateHandler(data[i][key]);
				}
				translations.push(translationItem);
			}

			this.data.dirty = false;
			this.data.output = translations;
			await uploadJSONToGCS(this, translations, this.id + '/translate');

			return translations.map((translatedItem, index) => {
				return { ...data[index], ...translatedItem };
			});
		}
	}
}

type TranslateNodeInterface = DGNodeInterface & {
	data: TranslateData;
};

export let translate_node_data: TranslateNodeInterface = {
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

export let translate_node = new TranslateNode(translate_node_data);

nodes.register(TranslateNode, translate_node_data);
