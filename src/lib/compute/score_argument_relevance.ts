import categories from '$lib/node_categories';
import { readFileFromGCS, uploadDataToGCS } from '$lib/utils';
import { cluster_extraction_system_prompt, score_claim_relevance_prompt } from '$lib/prompts';
import deepCopy from 'deep-copy';

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
	console.log('messages', messages);
	const res = await OpenAI.chat.completions.create({
		messages,
		model: 'gpt-4',
		temperature: 0.1
	});
	const resp = res.choices[0].message.content!;
	return resp;
}

export const score_argument_relevance = async (
	node: ScoreClaimRelevanceNode,
	inputData: object,
	context: string,
	info: (arg: string) => void,
	error: (arg: string) => void,
	success: (arg: string) => void,
	slug: string
) => {
	const { prompt, system_prompt } = node.data;
	const argument_extraction =
		inputData.argument_extraction || inputData[node.data.input_ids.argument_extraction];
	const open_ai_key = inputData.open_ai_key || inputData[node.data.input_ids.open_ai_key];

	console.log('Running score_argument_relevance');

	if (!argument_extraction || Object.values(argument_extraction).length == 0) {
		node.data.dirty = false;
		return;
	}

	if (
		!node.data.dirty &&
		node.data.csv_length == Object.values(argument_extraction).length &&
		node.data.gcs_path
	) {
		let doc = await readFileFromGCS(node);
		if (typeof doc === 'string') {
			doc = JSON.parse(doc);
		}
		node.data.output = doc;
		node.data.dirty = false;
		return node.data.output;
	}

	if (context == 'run' && open_ai_key && (prompt || system_prompt)) {
		const copy = deepCopy(argument_extraction);
		const funcs = [];
		for (const key of Object.keys(copy)) {
			const claims = copy[key];
			for (const claim of claims.claims) {
				const score_claim = async function () {
					const result = await gpt(
						open_ai_key,
						system_prompt,
						prompt,
						{ claim: JSON.stringify(claim, null, 2) },
						info,
						error,
						success
					);
					claim.score = JSON.parse(result).score;
				};
				funcs.push(score_claim);
			}
		}
		console.log(funcs);
		const chunkSize = 50;
		for (let i = 0; i < funcs.length; i += chunkSize) {
			const chunk = funcs.slice(i, i + chunkSize);
			await Promise.all(chunk.map((x) => x()));
		}
		node.data.output = copy;
		node.data.csv_length = Object.keys(copy).length;
		node.data.dirty = false;
		await uploadDataToGCS(node, node.data.output, slug);
		return node.data.output;
	}
};

interface ScoreArgumentRelevanceData extends ClusterExtractionData {
	// Inherits all properties from ClusterExtractionData
}

type ScoreArgumentRelevanceNode = DGNodeInterface & {
	data: ScoreArgumentRelevanceData;
};

export const score_argument_relevance_node: ScoreArgumentRelevanceNode = {
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
	position: { x: 0, y: 350 },
	type: 'prompt_v0'
};
