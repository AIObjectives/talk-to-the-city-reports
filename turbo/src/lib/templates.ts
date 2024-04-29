import { getDocs, doc, setDoc, query } from '@firebase/firestore/lite';
import { templatesCollection } from '$lib/firebase';
import { type DocumentData } from 'firebase/firestore';

import { open_ai_key_node } from './compute/open_ai_key_v0';
import { translate_node } from './compute/translate_v0';
import { csv_node } from './compute/csv_v0';
import { json_node } from './compute/json_v0';
import { limit_csv_node } from './compute/limit_csv_v0';
import { edit_csv_node } from './compute/edit_csv_v0';
import { cluster_extraction_node_v1 } from './compute/cluster_extraction_v1';
import { merge_cluster_extraction_node_v1 } from './compute/merge_cluster_extraction_v1';
import { argument_extraction_node_v1 } from './compute/argument_extraction_v1';
import { report_node_v1 } from './compute/report_v1';
import { participant_filter_node } from './compute/participant_filter_v0';
import { merge_node } from './compute/merge_v0';
import { jsonata_node } from './compute/jsonata_v0';
import { grid_node } from './compute/grid_v0';
import { count_tokens_node } from './compute/count_tokens_v0';
import { markdown_node } from './compute/markdown_v0';
import { jq_v1_node } from './compute/jq_v1';
import { stringify_node } from './compute/stringify_v0';
import { score_argument_relevance_node } from './compute/score_argument_relevance_v0';
import { feedback_node } from './compute/feedback_v0';
import { gpt_node } from './compute/gpt_v0';
import { multi_gpt_node } from './compute/multi_gpt_v0';
import { python_node } from './compute/python_v0';
import { pyodide_node } from './compute/pyodide_v0';
import { chat_node } from './compute/chat_v0';
import { webpage_node } from '$lib/compute/webpage_v0';
import { whisper_node } from '$lib/compute/whisper_v1';
import { multi_whisper_node } from '$lib/compute/multi_whisper_v0';
import { audio_node } from '$lib/compute/audio_v0';
import { multi_audio_node } from '$lib/compute/multi_audio_v0';
import { add_csv_node } from '$lib/compute/add_csv_v0';
import { filter_csv_node } from '$lib/compute/filter_csv_v0';
import { unique_node } from '$lib/compute/unique_v0';
import { comment_expander_node } from '$lib/compute/comment_expander_v0';
import { download_node } from '$lib/compute/download_v0';
import { text_to_csv_node } from '$lib/compute/text_to_csv_v0';
import { multi_cluster_extraction_node } from './compute/multi_cluster_extraction_v0';
import { summarize_node } from './compute/summarize_v0';
import { test_node } from './compute/test_v0';
import { integer_node } from './compute/integer_v0';
import { adder_node } from './compute/adder_v0';
import { text_node } from './compute/text_v0';
import { pinecone_node } from './compute/pinecone_v0';
import { gpt_embeddings_node } from './compute/gpt_embeddings_v0';
import { pinecone_key_node } from './compute/pinecone_key_v0';
import { secret_node } from './compute/secret_v0';

export const node_register = [
  gpt_embeddings_node,
  pinecone_node,
  open_ai_key_node,
  csv_node,
  json_node,
  edit_csv_node,
  cluster_extraction_node_v1,
  argument_extraction_node_v1,
  merge_node,
  participant_filter_node,
  report_node_v1,
  limit_csv_node,
  translate_node,
  jsonata_node,
  jq_v1_node,
  grid_node,
  count_tokens_node,
  merge_cluster_extraction_node_v1,
  markdown_node,
  stringify_node,
  score_argument_relevance_node,
  gpt_node,
  multi_gpt_node,
  feedback_node,
  python_node,
  pyodide_node,
  chat_node,
  webpage_node,
  whisper_node,
  multi_whisper_node,
  add_csv_node,
  audio_node,
  multi_audio_node,
  filter_csv_node,
  unique_node,
  comment_expander_node,
  download_node,
  text_to_csv_node,
  multi_cluster_extraction_node,
  summarize_node,
  test_node,
  adder_node,
  integer_node,
  text_node,
  pinecone_key_node,
  secret_node
];

export async function loadTemplates(): Promise<Record<string, DocumentData>> {
  const q = query(templatesCollection);
  const querySnapshot = await getDocs(q);

  const templates: Record<string, DocumentData> = {};
  querySnapshot.docs.forEach((doc) => {
    templates[doc.id] = doc.data();
  });

  return templates;
}

export async function saveTemplate(name: string, data: any) {
  for (const node of data.nodes) {
    node.data.output = {};
  }
  console.log(data);
  try {
    const docRef = doc(templatesCollection, name);
    await setDoc(docRef, data);
    console.log(`Template '${name}' successfully updated.`);
  } catch (error) {
    console.error('Error updating template:', error);
  }
}
