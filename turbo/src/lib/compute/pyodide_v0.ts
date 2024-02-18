import nodes from '$lib/node_register';
import categories from '$lib/node_categories';
import _ from 'lodash';

let pyodideInstance: any = null;

async function loadPyodide() {
  if (!pyodideInstance) {
    const module = await import('$lib/pyodide/pyodide.js');
    pyodideInstance = await module.loadPyodide();
  }
  return pyodideInstance;
}

const pyscript = `
import json

outputData = None

inputData = inputData.to_py()

{script}

# Serializing the output data to JSON
if outputData is not None:
    outputData = json.dumps(outputData)
`;

interface BaseData {}

interface PyodideData extends BaseData {
  script: string;
  output: object;
}

export default class PyodideNodeV0 {
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
    const pyodide = await loadPyodide();
    this.data.message = '';
    try {
      if (!_.isEmpty(this.data.output)) {
        return this.data.output;
      }
      const pyInput = {};
      _.keys(this.data.input_ids).forEach((key) => {
        const id = this.data.input_ids[key];
        if (id) {
          const value = inputData[id];
          pyInput[key] = typeof value === 'object' ? pyodide.toPy(value) : value;
        }
      });
      this.data.dirty = false;
      const script = pyscript.replace('{script}', this.data.text);
      pyodide.globals.set('inputData', pyInput);
      pyodide.runPython(script);
      const outputData = pyodide.globals.get('outputData');

      // Deserializing the JSON string back into a JavaScript object
      return outputData ? JSON.parse(outputData) : undefined;
    } catch (e) {
      console.error(e.toString());
      this.data.message = e.toString();
      error('Failed to execute Pyodide code');
      return undefined;
    }
  }
}

type PyodideNodeInterface = DGNodeInterface & {
  data: PyodideData;
};

export const pyodide_node_data: PyodideNodeInterface = {
  id: 'pyodide',
  data: {
    label: 'Pyodide',
    text: '',
    output: {},
    compute_type: 'pyodide_v0',
    input_ids: { data: '' },
    category: categories.wip.id,
    icon: 'python_v0',
    show_in_ui: false
  },
  position: { x: 0, y: 0 },
  type: 'pyodide_v0'
};

export const pyodide_node = new PyodideNodeV0(pyodide_node_data);

nodes.register(PyodideNodeV0, pyodide_node_data);
