import nodes from '$lib/node_register';
import categories from '$lib/node_categories';
import papa from 'papaparse';
import { browser } from '$app/environment';
import { readFileFromGCS } from '$lib/utils';
import type { BaseData, GCSBaseData, DGNodeInterface } from '$lib/node_data_types';

export interface CSVNodeInterface extends DGNodeInterface<GCSBaseData> {}

interface CSVData extends BaseData {
  filename: string;
  size_kb: number;
  gcs_path: string;
}

export default class CSVNode {
  id: string;
  data: CSVData;
  position: { x: number; y: number };
  type: string;

  constructor(node_data: CSVNodeInterface) {
    const { id, data, position, type } = node_data;
    this.id = id;
    this.data = data;
    this.position = position;
    this.type = type;
  }

  // these are the arguments that are passed to the compute function
  async compute(
    inputData: object,
    context: string,
    info: (arg: string) => void,
    error: (arg: string) => void,
    success: (arg: string) => void,
    slug: string,
    Cookies: any
  ) {
    if (!this.data.dirty && this.data.output && this.data.output.length > 0) {
      return this.data.output;
    }

    let contents;
    if (this.data.gcs_path) {
      // info('Loading ' + this.data.gcs_path.split('/').pop());
      contents = await readFileFromGCS(this);
      let parsedData: any = '';
      if (browser) parsedData = this.paparseCSV(contents);
      else parsedData = await this.csvParser(contents);
      this.data.output = this.filterValidRows(parsedData);
    }

    this.data.dirty = false;
    return this.data.output;
  }
  async csvParser(csvString: string): Promise<any[]> {
    const csvModule = await import('csv-parser');
    const csv = csvModule.default;
    const streamModule = await import('stream');
    const { Readable } = streamModule;

    return new Promise((resolve, reject) => {
      const results: any = [];
      Readable.from(csvString)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => resolve(results))
        .on('error', (err) => reject(err));
    });
  }

  paparseCSV(csv: string) {
    const parsedData = papa.parse(csv, { header: true }).data;
    return parsedData;
  }

  filterValidRows(parsedData: any[]) {
    const validRows = [];
    for (const row of parsedData) {
      if (this.isValidRow(row)) {
        validRows.push(row);
      }
    }
    return validRows;
  }

  isValidRow(row: object) {
    for (const column in row) {
      // @ts-ignore
      row[column] = row[column].trim();
    }
    let allEmpty = true;
    for (const column in row) {
      // @ts-ignore
      if (row[column] !== '') {
        allEmpty = false;
        break;
      }
    }
    return !allEmpty;
  }
}

// This data matters, as it is used for the tests
// please make sure it remains available
export const csv_node_data: CSVNodeInterface = {
  id: 'csv',
  data: {
    label: 'csv',
    filename: '',
    size_kb: 0,
    dirty: false,
    gcs_path: '',
    compute_type: 'csv_v0',
    input_ids: {},
    category: categories.input.id,
    icon: 'csv_v0',
    show_in_ui: true,
    message: ''
  },
  position: { x: 0, y: 0 },
  type: 'csv_v0'
};

// This is the node itself. It is created here as other parts of the
// code imports it for use in the system. Please keep it as is.
export const csv_node = new CSVNode(csv_node_data);

nodes.register(CSVNode, csv_node_data);
