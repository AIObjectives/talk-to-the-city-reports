import nodes from '$lib/node_register';
import categories from '$lib/node_categories';
import { readFileFromGCS, uploadDataToGCS } from '$lib/utils';
import { argument_extraction_prompt, argument_extraction_system_prompt } from '$lib/prompts';

async function gpt(
	apiKey: string,
	systemPrompt: string,
	promptTemplate: string,
	replacements: { [key: string]: string },
	info: (arg: string) => void,
	error: (arg: string) => void,
	success: (arg: string) => void
) {
	let vitest = import.meta.env.VITEST == 'true';
	let openai = (await import(vitest ? '$lib/mock_open_ai' : 'openai')).default;
	info('Calling OpenAI');
	let prompt = promptTemplate;
	for (const [key, value] of Object.entries(replacements)) {
		prompt = prompt.replace(`{${key}}`, value);
	}
	const OpenAI = new openai({ apiKey, dangerouslyAllowBrowser: true });
	const messages = [
		{ role: 'system', content: systemPrompt },
		{ role: 'user', content: prompt }
	];
	console.log(prompt);
	const res = await OpenAI.chat.completions.create({
		messages,
		model: 'gpt-4-1106-preview',
		response_format: { type: 'json_object' },
		temperature: 0.1
	});
	const resp = res.choices[0].message.content!;
	return resp;
}

async function processInChunks(array, handler, chunkSize) {
	for (let i = 0; i < array.length; i += chunkSize) {
		const chunk = array.slice(i, i + chunkSize);
		await Promise.all(chunk.map((item) => handler(item)));
	}
}

export default class ArgumentExtractionNode {
	id: string;
	data: ArgumentExtractionData;
	position: { x: number; y: number };
	type: string;

	constructor(node_data) {
		const { id, data, position, type } = node_data;
		this.id = id;
		this.data = data;
		this.position = position;
		this.type = type;
	}

	async compute(
		inputData: object,
		context: string,
		info: (arg: string) => void,
		error: (arg: string) => void,
		success: (arg: string) => void,
		slug: string
	) {
		const { prompt, system_prompt } = this.data;
		const csv = inputData.csv || inputData[this.data.input_ids.csv];
		const open_ai_key = inputData.open_ai_key || inputData[this.data.input_ids.open_ai_key];
		const cluster_extraction =
			inputData.cluster_extraction || inputData[this.data.input_ids.cluster_extraction];

		if (!csv || csv.length == 0 || !cluster_extraction) {
			this.data.dirty = false;
			return;
		}

		if (!this.data.dirty && this.data.csv_length == csv.length && this.data.gcs_path) {
			let doc = await readFileFromGCS(this);
			if (typeof doc === 'string') {
				doc = JSON.parse(doc);
			}
			this.data.output = doc;
			this.data.dirty = false;
			return this.data.output;
		}

		if (context == 'run' && open_ai_key && (prompt || system_prompt)) {
			this.data.output = {};

			const csv_by_ids = Object.fromEntries(csv.map((item) => [item['comment-id'], item]));
			async function extract_args(id) {
				const comment = csv_by_ids[id]['comment-body'];
				const interview = csv_by_ids[id]['interview'];
				const response = await gpt(
					open_ai_key,
					system_prompt,
					prompt,
					{
						comment,
						clusters: JSON.stringify(cluster_extraction)
					},
					info,
					error,
					success
				);
				this.data.output[id] = { id, comment, interview, ...JSON.parse(response) };
			}

			this.data.csv_length = csv.length;

			let ids = Object.keys(csv_by_ids);

			try {
				await processInChunks(ids, extract_args.bind(this), 50);
			} catch (err) {
				console.error(err);
			}
			this.data.dirty = false;
			await uploadDataToGCS(this, this.data.output, slug);
			return this.data.output;
		}
	}
}

interface ArgumentExtractionData extends ClusterExtractionData {
	// Inherits all properties from ClusterExtractionData
}

type ArgumentExtractionNodeInterface = DGNodeInterface & {
	data: ArgumentExtractionData;
};

export let argument_extraction_node_data: ArgumentExtractionNodeInterface = {
	id: 'argument_extraction',
	data: {
		label: 'Argument Extraction',
		output: {},
		text: '',
		system_prompt: argument_extraction_system_prompt,
		prompt: argument_extraction_prompt,
		csv_length: 0,
		dirty: false,
		compute_type: 'argument_extraction_v0',
		input_ids: { open_ai_key: '', csv: '', cluster_extraction: '' },
		category: categories.llm.id,
		icon: 'argument_extraction_v0'
	},
	position: { x: 0, y: 0 },
	type: 'prompt_v0'
};

export let argument_extraction_node = new ArgumentExtractionNode(argument_extraction_node_data);

nodes['argument_extraction_v0'] = argument_extraction_node;

nodes.register(ArgumentExtractionNode, argument_extraction_node_data);
