import openai from 'openai';

async function gpt(
	apiKey: string,
	systemPrompt: string,
	promptTemplate: string,
	replacements: { [key: string]: string }
) {
	console.log('calling openai on ...');
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

export const argument_extraction = async (node, inputData) => {
	if (!node.data.dirty) {
		console.log('Argument extraction not dirty. Returning.');
		return node.data.output;
	}
	console.log('Computing', node.data.label, 'with input data', inputData);
	if (node.data.output == null) {
		node.data.output = {};
	}
	const { prompt, system_prompt } = node.data;
	const { open_ai_key, cluster_extraction, csv } = inputData;

	const csv_by_ids = Object.fromEntries(csv.map((item) => [item['comment-id'], item]));
	async function extract_args(id) {
		const comment = csv_by_ids[id]['comment-body'];
		const interview = csv_by_ids[id]['interview'];
		console.log('running for id', id);
		const response = await gpt(open_ai_key, system_prompt, prompt, {
			comment,
			clusters: JSON.stringify(cluster_extraction)
		});
		node.data.output[id] = { id, comment, interview, ...JSON.parse(response) }; // Store output
	}

	let ids = Object.keys(csv_by_ids);
	ids.sort();
	ids = ids.slice(0, 10);

	const output_ids = Object.keys(node.data.output);
	ids = ids.filter((x) => !output_ids.includes(x));

	try {
		await processInChunks(ids, extract_args, 5);
	} catch (err) {
		console.error(err);
	}
	node.data.dirty =
		Object.keys(node.data.output).slice(0, 10).length !== Object.keys(node.data.output).length;
	return node.data.output;
};
