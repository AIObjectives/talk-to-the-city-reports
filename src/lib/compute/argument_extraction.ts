import openai from 'openai';
import { readFileFromGCS, uploadDataToGCS } from '$lib/utils';
import { extraction_prompt, summary_prompt } from '$lib/prompts';

async function gpt(
	apiKey: string,
	systemPrompt: string,
	promptTemplate: string,
	replacements: { [key: string]: string },
	info,
	error,
	success
) {
	console.log('calling openai on ...');
	info('Calling OpenAI');
	let prompt = promptTemplate;
	for (const [key, value] of Object.entries(replacements)) {
		prompt = prompt.replace(`{${key}}`, value);
	}
	const OpenAI = new openai({ apiKey, dangerouslyAllowBrowser: true });
	const res = await OpenAI.chat.completions.create({
		messages: [
			{ role: 'system', content: systemPrompt },
			{ role: 'user', content: prompt }
		],
		model: 'gpt-4-1106-preview',
		response_format: { type: 'json_object' },
		temperature: 0.1
	});
	return res.choices[0].message.content!;
}

async function processInChunks(array, handler, chunkSize) {
	for (let i = 0; i < array.length; i += chunkSize) {
		const chunk = array.slice(i, i + chunkSize);
		await Promise.all(chunk.map((item) => handler(item)));
	}
}

export const argument_extraction = async (node, inputData, context, info, error, success, slug) => {
	console.log('Computing', node.data.label, 'with input data', inputData);
	const { prompt, system_prompt } = node.data;
	const csv = inputData.csv || inputData[node.data.input_ids.csv];
	const open_ai_key = inputData.open_ai_key || inputData[node.data.input_ids.open_ai_key];
	const cluster_extraction =
		inputData.cluster_extraction || inputData[node.data.input_ids.cluster_extraction];

	if (!csv || csv.length == 0 || !cluster_extraction) {
		node.data.dirty = false;
		return;
	}

	if (!node.data.dirty && node.data.csv_length == csv.length && node.data.gcs_path) {
		let doc = await readFileFromGCS(node);
		if (typeof doc === 'string') {
			doc = JSON.parse(doc);
		}
		node.data.output = doc;
		node.data.dirty = false;
		console.log('Already computed', node.data.label);
		return node.data.output;
	}

	if (context == 'run') {
		node.data.output = {};

		const csv_by_ids = Object.fromEntries(csv.map((item) => [item['comment-id'], item]));
		async function extract_args(id) {
			const comment = csv_by_ids[id]['comment-body'];
			const interview = csv_by_ids[id]['interview'];
			console.log('running for id', id);
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
			node.data.output[id] = { id, comment, interview, ...JSON.parse(response) };
		}

		node.data.csv_length = csv.length;

		let ids = Object.keys(csv_by_ids);

		try {
			await processInChunks(ids, extract_args, 10);
		} catch (err) {
			console.error(err);
		}
		success('Done computing ' + node.data.label);
		node.data.dirty = false;
		await uploadDataToGCS(node, node.data.output, slug);
		return node.data.output;
	}
};

interface ArgumentExtractionData extends ClusterExtractionData {
	// Inherits all properties from ClusterExtractionData
}

type ArgumentExtractionNode = DGNodeInterface & {
	data: ArgumentExtractionData;
};

export const argument_extraction_node: ArgumentExtractionNode = {
	id: 'argument_extraction',
	data: {
		label: 'Argument Extraction',
		output: {},
		text: '',
		system_prompt:
			'You are a professional research assistant. You have helped run many public consultations, surveys and citizen assemblies. You have good instincts when it comes to extracting interesting insights. You are familiar with public consultation tools like Pol.is and you understand the benefits for working with very clear, concise claims that other people would be able to vote on.',
		prompt: extraction_prompt,
		csv_length: 0,
		dirty: false,
		compute_type: 'argument_extraction_v0',
		input_ids: { open_ai_key: '', csv: '', cluster_extraction: '' },
		compute: argument_extraction
	},
	position: { x: 0, y: 350 },
	type: 'prompt_v0'
};
