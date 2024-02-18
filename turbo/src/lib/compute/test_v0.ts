import nodes from '$lib/node_register';
import categories from '$lib/node_categories';
import type { BaseData, DGNodeInterface } from '$lib/node_data_types';

export default class TestNode {
  id: string;
  data: TestData;
  position: { x: number; y: number };
  type: string;

  constructor(node_data: TestNodeInterface) {
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
    const a = inputData ? inputData['a'] || inputData[this.data.input_ids.a] : this.data.a;
    const b = inputData ? inputData['b'] || inputData[this.data.input_ids.b] : this.data.b;
    return { c: a + b, d: a - b };
  }
}

interface TestData extends BaseData {
  output: Record<string, any>;
  a: number;
  b: number;
}

type TestNodeInterface = DGNodeInterface & {
  data: TestData;
};

export const test_node_data: TestNodeInterface = {
  id: 'test_v0',
  data: {
    label: 'test_v0',
    compute_type: 'test_v0',
    input_ids: { a: '', b: '' },
    output_ids: { c: '', d: '' },
    category: categories.wip.id,
    icon: 'test_v0',
    show_in_ui: true,
    message: '',
    output: {},
    dirty: false,
    a: 0,
    b: 0
  },
  position: { x: 0, y: 0 },
  type: 'default_v0'
};

export const test_node = new TestNode(test_node_data);

nodes.register(TestNode, test_node_data);
