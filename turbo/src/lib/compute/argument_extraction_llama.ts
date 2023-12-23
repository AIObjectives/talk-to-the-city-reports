// import nodes from '$lib/node_register';
// import categories from '$lib/node_categories';
// import system_prompt from '$lib/mock_data/argument_extraction/system_prompt.txt?raw';

// import {
// 	argument_extraction_llama_system_prompt,
// 	argument_extraction_llama_prompt
// } from '$lib/prompts';

// export const argument_extraction_llama = async (
// 	node: LlamaNode,
// 	inputData: object,
// 	context: string,
// 	info: (arg: string) => void,
// 	error: (arg: string) => void,
// 	success: (arg: string) => void,
// 	slug: string,
// 	Cookies: any
// ) => {
// 	node.data.message = 'fetching...';
// 	node.data.dirty = false;
// 	const system_prompt = node.data.system_prompt;
// 	let prompt = node.data.prompt;
// 	const csv = inputData.csv || inputData[node.data.input_ids.csv];
// 	const llama = inputData.llama || inputData[node.data.input_ids.llama];

// 	if (!csv || csv.length == 0 || (!system_prompt && !prompt)) {
// 		node.data.dirty = false;
// 		return;
// 	}

//     for (let entry of csv)
//     {

//         const comment = entry['comment-body'];

// 	prompt = prompt.replace('{comment}', comment);

// 	const data = {
// 		messages: [{ role: 'user', content: prompt }],
// 		stop: ['### Instruction:'],
// 		temperature: 0.7,
// 		max_tokens: -1,
// 		stream: false
// 	};

// 	const response = await fetch(llama, {
// 		method: 'POST',
// 		headers: {
// 			'Content-Type': 'application/json'
// 		},
// 		body: JSON.stringify(data)
// 	});
// 	node.data.dirty = false;

// 	const result = (await response.json()).choices[0].message.content;

// 	return [{ result: result }];
// };

// interface ArgumentExtractionLlamaData extends BaseData {
// 	text: string;
// }

// type ArgumentExtractionLlamaNode = DGNodeInterface & {
// 	data: ArgumentExtractionLlamaData;
// };

// export const argument_extraction_llama_node: ArgumentExtractionLlamaNode = {
// 	id: 'argument_extraction_llama',
// 	data: {
// 		label: 'Argument Extraction',
// 		text: 'http://localhost:10000/v1/chat/completions',
// 		system_prompt: argument_extraction_llama_system_prompt,
// 		prompt: argument_extraction_llama_prompt,
// 		csv_length: 0,
// 		dirty: false,
// 		compute_type: 'argument_extraction_llama_v0',
// 		input_ids: { csv: '', llama: '' },
// 		category: categories.llama.id,
// 		icon: 'llama_v0'
// 	},
// 	position: { x: 0, y: 0 },
// 	type: 'prompt_v0'
// };

// nodes.register(ArgumentExtractionLlamaNode, argument_extraction_llama_node_data)
