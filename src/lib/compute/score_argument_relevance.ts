import nodes from '$lib/node_register';
import { readFileFromGCS, uploadJSONToGCS } from '$lib/utils';
import { cluster_extraction_system_prompt, score_claim_relevance_prompt } from '$lib/prompts';
import deepCopy from 'deep-copy';
import categories from '$lib/node_categories';

export default class ScoreArgumentRelevanceNode {
	id: string;
	data: ScoreArgumentRelevanceData;
	position: { x: number; y: number };
	type: string;

	constructor(node_data: ScoreArgumentRelevanceNodeInterface) {
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
		const argument_extraction =
			inputData.argument_extraction || inputData[this.data.input_ids.argument_extraction];
		const open_ai_key = inputData.open_ai_key || inputData[this.data.input_ids.open_ai_key];

		if (!argument_extraction || Object.values(argument_extraction).length == 0) {
			this.data.dirty = false;
			return;
		}

		if (
			!this.data.dirty &&
			this.data.csv_length == Object.values(argument_extraction).length &&
			this.data.gcs_path
		) {
			let doc = await readFileFromGCS(this);
			if (typeof doc === 'string') {
				doc = JSON.parse(doc);
			}
			this.data.output = doc;
			this.data.dirty = false;
			return this.data.output;
		}

		if (context == 'run' && open_ai_key && (prompt || system_prompt)) {
			const copy = deepCopy(argument_extraction);
			const funcs = [];
			for (const key of Object.keys(copy)) {
				const claims = copy[key];
				for (const claim of claims.claims) {
					const score_claim = async () => {
						const result = await this.gpt(
							open_ai_key,
							system_prompt,
							prompt,
							{ claim: JSON.stringify(claim, null, 2) },
							info,
							error,
							success
						);
						claim.score = JSON.parse(result).score;
						claim.explanation = JSON.parse(result).explanation;
					};
					funcs.push(score_claim);
				}
			}
			const chunkSize = 50;
			for (let i = 0; i < funcs.length; i += chunkSize) {
				const chunk = funcs.slice(i, i + chunkSize);
				await Promise.all(chunk.map((x) => x()));
			}
			this.data.output = copy;
			this.data.csv_length = Object.keys(copy).length;
			this.data.dirty = false;
			await uploadJSONToGCS(this, this.data.output, slug);
			return this.data.output;
		}
	}

	private async gpt(
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
		const res = await OpenAI.chat.completions.create({
			messages,
			model: 'gpt-4',
			temperature: 0.1
		});
		const resp = res.choices[0].message.content!;
		return resp;
	}
}

interface ScoreArgumentRelevanceData extends ClusterExtractionData {
	// Inherits all properties from ClusterExtractionData
}

type ScoreArgumentRelevanceNodeInterface = DGNodeInterface & {
	data: ScoreArgumentRelevanceData;
};

export let score_argument_relevance_node_data: ScoreArgumentRelevanceNodeInterface = {
	id: 'score_argument_relevance',
	data: {
		label: 'Score Argument Relevance',
		output: {},
		text: '',
		system_prompt: cluster_extraction_system_prompt,
		prompt: score_claim_relevance_prompt,
		csv_length: 0,
		dirty: false,
		compute_type: 'score_argument_relevance_v0',
		input_ids: { open_ai_key: '', argument_extraction: '' },
		category: categories.llm.id,
		icon: 'score_argument_relevance_v0'
	},
	position: { x: 0, y: 0 },
	type: 'prompt_v0'
};

export let score_argument_relevance_node = new ScoreArgumentRelevanceNode(
	score_argument_relevance_node_data
);

nodes.register(ScoreArgumentRelevanceNode, score_argument_relevance_node_data);
