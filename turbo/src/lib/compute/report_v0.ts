import nodes from '$lib/node_register';
import categories from '$lib/node_categories';

export default class ReportNode {
  id: string;
  data: ReportData;
  position: { x: number; y: number };
  type: string;

  constructor(node_data: ReportNodeInterface) {
    const { id, data, position, type } = node_data;
    this.id = id;
    this.data = data;
    this.position = position;
    this.type = type;
  }

  sortData(data) {
    if (!data) return data;
    data.topics?.forEach((topic) => {
      topic.subtopics?.forEach((subtopic) => {
        subtopic.claims = subtopic.claims.sort((a, b) => a.id.localeCompare(b.id));
      });
    });
    data.topics?.forEach((topic) => {
      topic.subtopics = topic.subtopics?.sort((a, b) => b.claims.length - a.claims.length);
    });
    data.topics = data.topics?.sort((a, b) => {
      const totalClaimsA = a.subtopics.reduce((acc, subtopic) => acc + subtopic.claims.length, 0);
      const totalClaimsB = b.subtopics.reduce((acc, subtopic) => acc + subtopic.claims.length, 0);
      return totalClaimsB - totalClaimsA;
    });
    return data;
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
    this.data.dirty = false;
    const input = inputData[Object.keys(inputData)[0]];
    this.data.output = this.sortData(input);
    return input;
  }
}

interface ReportData extends BaseData {
  output: object;
}

type ReportNodeInterface = DGNodeInterface & {
  data: ReportData;
};

export const report_node_data: ReportNodeInterface = {
  id: 'report_v0',
  data: {
    label: 'report v0',
    output: {},
    dirty: false,
    compute_type: 'report_v0',
    input_ids: { data: '' },
    category: categories.display.id,
    icon: 'report_v0'
  },
  position: { x: 0, y: 0 },
  type: 'default_v0',
  show_in_ui: false
};

export const report_node_v0 = new ReportNode(report_node_data);

nodes.register(ReportNode, report_node_data);
