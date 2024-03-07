// stock
import deepCopy from 'deep-copy';

// data
import cluster_prompt from '$lib/mock_data/cluster_extraction/prompt.txt?raw';
import cluster_system_prompt from '$lib/mock_data/cluster_extraction/system_prompt.txt?raw';
import arg_prompt from '$lib/mock_data/argument_extraction/v1/prompt.txt?raw';
import arg_prompt_suffix from '$lib/mock_data/argument_extraction/v1/prompt_suffix.txt?raw';
import arg_system_prompt from '$lib/mock_data/argument_extraction/system_prompt.txt?raw';

// nodes
import CSVNode, { csv_node_data } from '$lib/compute/csv_v0';
import JqNodeV1, { jq_node_data } from '$lib/compute/jq_v1';
import OpenAIKeyNode, { open_ai_key_node_data } from '$lib/compute/open_ai_key_v0';
import ClusterExtractionNode, {
  cluster_extraction_node_data_v0
} from '$lib/compute/cluster_extraction_v0';
import ArgumentExtractionNode, {
  argument_extraction_node_data_v1
} from '$lib/compute/argument_extraction_v1';
import MergeNode, { merge_node_data } from '$lib/compute/merge_v0';
import ChatNode, { chat_node_data } from '$lib/compute/chat_v0';
import GPTEmbeddingsNode, { gpt_embeddings_node_data } from '$lib/compute/gpt_embeddings_v0';
import PineconeNode, { pinecone_node_data } from '$lib/compute/pinecone_v0';
import PineconeKeyNode, { pinecone_key_node_data } from '$lib/compute/pinecone_key_v0';
import MarkdownNode, { markdown_node_data } from '$lib/compute/markdown_v0';

// dataset
import { Dataset } from '$lib/dataset';

// utilities
import Cookies from './js-cookie';

export function get_open_ai_key() {
  const node = new OpenAIKeyNode(deepCopy(open_ai_key_node_data));
  node.data.text = 'sk-' + 'a'.repeat(48);
  Cookies.set('open_ai_key', node.data.text);
  return node;
}

export function get_csv() {
  const csv_data = deepCopy(csv_node_data);
  const csv = new CSVNode(csv_data);
  csv.data.gcs_path = 'path/to/file.csv';
  return csv;
}

export function get_jq() {
  const jq = new JqNodeV1(jq_node_data);
  jq.data.text = '.';
  return jq;
}

export function get_cluster_extraction() {
  const node = new ClusterExtractionNode(deepCopy(cluster_extraction_node_data_v0));
  node.data.prompt = cluster_prompt;
  node.data.system_prompt = cluster_system_prompt;
  node.data.input_ids.csv = 'jq_v1';
  node.data.input_ids.open_ai_key = 'open_ai_key';
  return node;
}

export function get_argument_extraction() {
  const node = new ArgumentExtractionNode(deepCopy(argument_extraction_node_data_v1));
  node.data.prompt = arg_prompt;
  node.data.prompt_suffix = arg_prompt_suffix;
  node.data.system_prompt = arg_system_prompt;
  node.data.input_ids.csv = 'jq_v1';
  node.data.input_ids.open_ai_key = 'open_ai_key';
  node.data.input_ids.cluster_extraction = 'cluster_extraction';
  return node;
}

export function get_merge() {
  const node = new MergeNode(deepCopy(merge_node_data));
  node.data.input_ids.argument_extraction = 'argument_extraction';
  node.data.input_ids.cluster_extraction = 'cluster_extraction';
  return node;
}

export function get_chat(data = 'merge') {
  const node = new ChatNode(deepCopy(chat_node_data));
  node.data.input_ids.open_ai_key = 'open_ai_key';
  node.data.input_ids.data = data;
  return node;
}

export function get_gpt_embeddings(data = 'argument_extraction') {
  const node = new GPTEmbeddingsNode(deepCopy(gpt_embeddings_node_data));
  node.data.input_ids.open_ai_key = 'open_ai_key';
  node.data.input_ids.data = data;
  return node;
}

export function get_pinecone_key() {
  const node = new PineconeKeyNode(deepCopy(pinecone_key_node_data));
  node.data.text = 'sk-' + 'a'.repeat(48);
  return node;
}

export function get_pinecone() {
  const node = new PineconeNode(deepCopy(pinecone_node_data));
  node.data.input_ids.pinecone_api_key = 'pinecone_key';
  node.data.input_ids.embeddings = 'gpt_embeddings';
  return node;
}

export function get_markdown() {
  const node = new MarkdownNode(deepCopy(markdown_node_data));
  node.position = { x: -119, y: 250 };
  node.data.markdown = 'Hello Markdown';
  return node;
}

export function get_graph() {
  const csv = get_csv();
  const jq = get_jq();
  const oaikey = get_open_ai_key();
  const ce = get_cluster_extraction();
  const ae = get_argument_extraction();
  const gptemb = get_gpt_embeddings();
  const pck = get_pinecone_key();
  const pc = get_pinecone();
  const merge = get_merge();
  const chat = get_chat();
  const nodes = [csv, jq, oaikey, ce, ae, merge, chat, pck, pc, gptemb];
  const edges = [
    {
      source: csv_node_data.id,
      target: jq_node_data.id
    },
    {
      source: jq_node_data.id,
      target: cluster_extraction_node_data_v0.id
    },
    {
      source: open_ai_key_node_data.id,
      target: cluster_extraction_node_data_v0.id
    },
    {
      source: jq_node_data.id,
      target: argument_extraction_node_data_v1.id
    },
    {
      source: cluster_extraction_node_data_v0.id,
      target: argument_extraction_node_data_v1.id
    },
    {
      source: open_ai_key_node_data.id,
      target: argument_extraction_node_data_v1.id
    },
    {
      source: argument_extraction_node_data_v1.id,
      target: merge_node_data.id
    },
    {
      source: cluster_extraction_node_data_v0.id,
      target: merge_node_data.id
    },
    {
      source: merge_node_data.id,
      target: chat_node_data.id
    },
    {
      source: open_ai_key_node_data.id,
      target: chat_node_data.id
    },
    {
      source: pinecone_key_node_data.id,
      target: pinecone_node_data.id
    },
    {
      source: gpt_embeddings_node_data.id,
      target: pinecone_node_data.id
    }
  ];
  return { nodes: nodes, edges: edges };
}

export function getDataset() {
  return new Dataset('title', '/test', 'owner', 'template', 'description', get_graph(), 'id');
}

export function getSimpleGraph() {
  const key = get_open_ai_key();
  const markdown = get_markdown();
  const nodes = [key, markdown];
  const edges = [
    {
      source: open_ai_key_node_data.id,
      target: markdown_node_data.id,
      id: open_ai_key_node_data.id + markdown_node_data.id
    }
  ];
  return { nodes: nodes, edges: edges };
}

export function getMarkdownToChatGraph() {
  const markdown = get_markdown();
  const chat = get_chat('markdown');
  const openai = get_open_ai_key();
  const nodes = [markdown, chat, openai];
  const edges = [
    {
      source: markdown_node_data.id,
      target: chat_node_data.id
    },
    {
      source: open_ai_key_node_data.id,
      target: chat_node_data.id
    }
  ];
  return { nodes: nodes, edges: edges };
}

export function getMarkdownToChatDataset() {
  return new Dataset(
    'title',
    '/test',
    'owner',
    'template',
    'description',
    getMarkdownToChatGraph(),
    'id'
  );
}

export function getSimpleDataset() {
  return new Dataset('title', '/test', 'owner', 'template', 'description', getSimpleGraph(), 'id');
}
