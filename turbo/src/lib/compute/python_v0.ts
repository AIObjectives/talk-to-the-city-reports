import type { DGNodeInterface, BaseData } from '$lib/node_data_types';
import nodes from '$lib/node_register';
import categories from '$lib/node_categories';
import _ from 'lodash';

const scriptTemplate = `
import json

inputData = {inputData}
outputData = None

{script}

`;

const dev = 'http://localhost:8000/';
const prod = import.meta.env.VITE_PYTHON_LAMBDA_URL;
const url = prod;

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
    const data = [];
    _.keys(this.data.input_ids.inputs).forEach((k) => {
      const id = this.data.input_ids.inputs[k];
      if (id) {
        data.push(inputData[id]);
      }
    });
    let script = scriptTemplate.replace('{inputData}', JSON.stringify(data));
    console.log(script);
    script = script.replace('{script}', this.data.text);
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: import.meta.env.VITE_PYTHON_LAMBDA_SECRET
        },
        body: JSON.stringify({ code: script })
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const j = await response.json();
      let outputData = {};
      if (_.isString(j)) {
        try {
          outputData = JSON.parse(j);
        } catch (e) {
          outputData = j;
        }
      } else {
        outputData = j;
      }
      this.data.output = outputData;
      return outputData;
    } catch (e) {
      error(e.message);
    }
  }
}

interface PythonData extends BaseData {
  script: string;
  output: object;
  text: string;
}

type PythonNodeInterface = DGNodeInterface & {
  data: PythonData;
};

export const python_node_data: PythonNodeInterface = {
  id: 'python',
  data: {
    label: 'python',
    text: '',
    output: {},
    compute_type: 'python_v0',
    input_ids: { inputs: [] },
    category: categories.lang.id,
    icon: 'python_v0',
    show_in_ui: false,
    show_to_anon: false,
    dirty: false,
    message: '',
    script: ''
  },
  position: { x: 0, y: 0 },
  type: 'python_v0'
};

export const python_node = new PythonNodeV0(python_node_data);

nodes.register(PythonNodeV0, python_node_data);
