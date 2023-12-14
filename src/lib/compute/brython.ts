import nodes from '$lib/node_register';
import categories from '$lib/node_categories';
import _ from 'lodash';
// import brscript from '$lib/compute/brython.py?raw';

let brscript = `\
from browser import document\n\
import json\n\
\n\
inputData = {inputData}\n\
outputData = None\n\
\n\
\n\
{script}
\n\
\n\
if outputData is not None:\n\
    document["output"].textContent = json.dumps(outputData)\n\
`;

interface BaseData {}

interface BrythonData extends BaseData {
	script: string;
	output: object;
}

export default class BrythonNodeV0 {
	id: string;
	data: BrythonData;
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
		slug: string,
		Cookies: any
	) {
		this.data.output = {};
		try {
			const script = document.createElement('script');
			script.type = 'text/python';
			let pyscript = brscript;
			pyscript = brscript.replace(/{inputData}/g, JSON.stringify(inputData));
			pyscript = pyscript.replace(/{script}/g, this.data.text);
			script.text = pyscript;
			document.body.appendChild(script);
			brython();

			let outputPromise = new Promise((resolve, reject) => {
				let outputElement = document.getElementById('output');
				let observer = new MutationObserver((mutationsList, observer) => {
					for (let mutation of mutationsList) {
						if (mutation.type === 'childList') {
							resolve(outputElement.textContent);
							observer.disconnect();
						}
					}
				});
				observer.observe(outputElement, { childList: true });
			});

			try {
				let outputText = await outputPromise;
				this.data.output = JSON.parse(outputText);
			} catch (e) {
				console.log(e);
			}

			script.remove();
			return this.data.output;
		} catch (e) {
			console.error(e.toString());
			this.data.message = e.toString();
			error('Failed to execute Brython code');
			return undefined;
		}
	}
}

type BrythonNodeInterface = DGNodeInterface & {
	data: BrythonData;
};

export let brython_node_data: BrythonNodeInterface = {
	id: 'brython_v0',
	data: {
		label: 'Brython',
		text: '',
		output: {},
		compute_type: 'brython_v0',
		input_ids: {},
		category: categories.wrangling.id,
		icon: 'jq_v0',
		show_in_ui: false
	},
	position: { x: 0, y: 0 },
	type: 'text_input_v0'
};

export let brython_node = new BrythonNodeV0(brython_node_data);

nodes.register(BrythonNodeV0, brython_node_data);
