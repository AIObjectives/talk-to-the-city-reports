import nodes from '$lib/node_register';
import categories from '$lib/node_categories';
import _ from 'lodash';
import deepCopy from 'deep-copy';
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

interface PythonData extends BaseData {
	script: string;
	output: object;
}

export default class PythonNodeV0 {
	id: string;
	data: PythonData;
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
		try {
			if (!_.isEmpty(this.data.output)) {
				return this.data.output;
			}
			console.log('computing python node ' + this.id);
			let input = {};
			_.forEach(this.data.input_ids, (value, key) => {
				input[key] = inputData[value];
			});
			this.data.dirty = false;
			const script = document.createElement('script');
			script.type = 'text/python';
			let pyscript = brscript;
			pyscript = brscript.replace(/{inputData}/g, JSON.stringify(input));
			pyscript = pyscript.replace(/{script}/g, this.data.text);
			script.text = pyscript;
			document.body.appendChild(script);
			brython();
			script.remove();

			let observer;

			let outputPromise = new Promise((resolve, reject) => {
				let outputElement = document.getElementById('output');
				observer = new MutationObserver((mutationsList, observer) => {
					for (let mutation of mutationsList) {
						if (mutation.type === 'childList') {
							resolve(outputElement.textContent);
							observer.disconnect();
						}
					}
				});
				observer.observe(outputElement, { childList: true });
			});

			outputPromise.finally(() => {
				if (observer) {
					observer.disconnect();
				}
			});

			try {
				console.log('waiting for output');
				let outputText = await outputPromise;
				this.data.output = JSON.parse(outputText);
			} catch (e) {
				console.log(e);
			}

			return this.data.output;
		} catch (e) {
			console.error(e.toString());
			this.data.message = e.toString();
			error('Failed to execute Brython code');
			return undefined;
		}
	}
}

type PythonNodeInterface = DGNodeInterface & {
	data: PythonData;
};

export let python_node_data: PythonNodeInterface = {
	id: 'python_v0',
	data: {
		label: 'Brython',
		text: '',
		output: {},
		compute_type: 'python_v0',
		input_ids: {
			input_0: '',
			input_1: '',
			input_2: '',
			input_3: '',
			input_4: '',
			input_5: '',
			input_6: '',
			input_7: '',
			input_8: '',
			input_9: '',
			input_10: '',
			input_11: ''
		},
		category: categories.lang.id,
		icon: 'python_v0',
		show_in_ui: false
	},
	position: { x: 0, y: 0 },
	type: 'text_input_v0'
};

export let python_node = new PythonNodeV0(python_node_data);

nodes.register(PythonNodeV0, python_node_data);
