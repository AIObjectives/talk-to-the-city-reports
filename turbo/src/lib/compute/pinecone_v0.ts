import { Dataset } from '$lib/dataset';
import { Pinecone } from '@pinecone-database/pinecone';
import nodes from '$lib/node_register';
import categories from '$lib/node_categories';
import type { DGNodeInterface, BaseData } from '$lib/node_data_types';
import _ from 'lodash';

export default class PineconeNode {
  id: string;
  data: PineconeNodeData;
  position: { x: number; y: number };
  type: string;
  pc: Pinecone | null;

  constructor(node_data: PineconeNodeInterface) {
    const { id, data, position, type } = node_data;
    this.id = id;
    this.data = data;
    this.position = position;
    this.type = type;
    this.pc = null;
  }

  initPinecone(dataset) {
    const keyNode = dataset.graph.findImpl(this.data.input_ids.pinecone_api_key);
    this.pc = new Pinecone({
      apiKey: keyNode.data.output
    });
  }

  requireIndexName() {
    if (!this.data.index_name) {
      throw new Error('Index name not set');
    }
  }

  async upsert(embeddings, info) {
    let index;
    try {
      index = await this.pc.describeIndex(this.data.index_name);
    } catch (e) {
      index = await this.pc.createIndex({
        name: this.data.index_name,
        dimension: 1536,
        metric: 'euclidean',
        spec: {
          serverless: {
            cloud: 'aws',
            region: 'us-west-2'
          }
        }
      });
    }
    index = this.pc.index(this.data.index_name);
    try {
      await index.namespace(`${this.data.namespace}_claims`).deleteAll();
    } catch (e) {
      console.log('Tried to delete all but there was nothing to delete');
    }
    for (let embedding of embeddings) {
      // remove non-ascii characters from embedding.id
      embedding.id = embedding.id.replace(/[^\x00-\x7F]/g, '');
      await index.namespace(`${this.data.namespace}_claims`).upsert([embedding]);
      info('Embeddings upserted');
    }
  }

  async query_pinecone(term, topK, dataset: Dataset) {
    this.initPinecone(dataset);
    this.requireIndexName();
    const embeddingsNode = dataset.graph.findImpl(this.data.input_ids.embeddings.split('|')[0]);
    const embedding = await embeddingsNode.createEmbeddings(term, dataset);
    const index = this.pc.index(this.data.index_name);
    const response = await index.namespace(`${this.data.namespace}_claims`).query({
      topK: topK,
      vector: embedding.data[0].embedding,
      includeValues: true
    });
    return response?.matches.map((x) => ({ claim: x.id, score: x.score }));
  }

  tools() {
    let tools = [
      {
        type: 'function',
        function: {
          name: 'query_pinecone',
          description: 'Query pinecone index with search term for nearest neighbors',
          parameters: {
            type: 'object',
            properties: {
              term: {
                type: 'string',
                description: 'The term to search for in the pinecone index'
              },
              topK: { type: 'number', description: 'The number of nearest neighbors to return' }
            },
            required: ['term', 'topK']
          }
        }
      }
    ];
    return tools;
  }

  async compute(
    inputData: Record<string, any>,
    context: string,
    info: (arg: string) => void,
    error: (arg: string) => void,
    success: (arg: string) => void,
    slug: string,
    Cookies: any,
    dataset: any
  ) {
    let embeddings = inputData.embeddings || inputData[this.data.input_ids.embeddings as string];
    let api_key =
      inputData.pinecone_api_key || inputData[this.data.input_ids.pinecone_api_key as string];
    if (api_key) this.initPinecone(dataset);
    if (context == 'run' && embeddings?.length != this.data.length) {
      if (!api_key) {
        error('No Pinecone API key input');
        return;
      }
      this.data.namespace = _.kebabCase(slug);
      if (embeddings) {
        await this.upsert(embeddings, info);
        this.data.length = embeddings.length;
      }
    }
    if (api_key) return { indexes: await this.pc.listIndexes(), tools: this.tools() };
  }
}

interface PineconeNodeData extends BaseData {
  output: any;
  length: number;
  index_name: string;
  namespace: string;
}

type PineconeNodeInterface = DGNodeInterface & {
  data: PineconeNodeData;
};

export let pinecone_node_data: PineconeNodeInterface = {
  id: 'pinecone',
  data: {
    label: 'pinecone',
    dirty: false,
    output: {},
    compute_type: 'pinecone_v0',
    input_ids: { embeddings: '', pinecone_api_key: '' },
    output_ids: { tools: '' },
    category: categories.ml.id,
    icon: 'pinecone_v0',
    show_in_ui: true,
    message: '',
    length: 0,
    index_name: 'tttc',
    namespace: ''
  },
  position: { x: 0, y: 0 },
  type: 'pinecone_v0'
};

export let pinecone_node = new PineconeNode(pinecone_node_data);

nodes.register(PineconeNode, pinecone_node_data);
