import { getDocs, doc, setDoc, query } from '@firebase/firestore/lite';
import { templatesCollection } from '$lib/firebase';
import { type DocumentData } from 'firebase/firestore';

import { open_ai_key_node } from './compute/open_ai_key';
import { translate_node } from './compute/translate';
import { csv_node } from './compute/csv';
import { json_node } from './compute/json';
import { limit_csv_node } from './compute/limit_csv';
import { edit_csv_node } from './compute/edit_csv';
import { cluster_extraction_node_v0 } from './compute/cluster_extraction_v0';
import { cluster_extraction_node_v1 } from './compute/cluster_extraction_v1';
import { merge_cluster_extraction_node } from './compute/merge_cluster_extraction';
import { argument_extraction_node_v0 } from './compute/argument_extraction_v0';
import { argument_extraction_node_v1 } from './compute/argument_extraction_v1';
import { report_node_v0 } from './compute/report_v0';
import { report_node_v1 } from './compute/report_v1';
import { participant_filter_node } from './compute/participant_filter';
import { merge_node } from './compute/merge';
import { jsonata_node } from './compute/jsonata';
import { grid_node } from './compute/grid';
import { count_tokens_node } from './compute/count_tokens';
import { markdown_node } from './compute/markdown';
import { jq_v1_node } from './compute/jq_v1';
import { stringify_node } from './compute/stringify';
import { score_argument_relevance_node } from './compute/score_argument_relevance';
import { feedback_node } from './compute/feedback';
import { gpt_node } from './compute/gpt';
import { python_node } from './compute/python';
import { pyodide_node } from './compute/pyodide';
import { chat_node } from './compute/chat';
import { webpage_node } from '$lib/compute/webpage';
// import { llama_node } from './compute/llama';
// import { argument_extraction_llama_node } from './compute/argument_extraction_llama';

export let node_register = [
	open_ai_key_node,
	csv_node,
	json_node,
	edit_csv_node,
	cluster_extraction_node_v0,
	cluster_extraction_node_v1,
	argument_extraction_node_v0,
	argument_extraction_node_v1,
	merge_node,
	participant_filter_node,
	report_node_v0,
	report_node_v1,
	limit_csv_node,
	translate_node,
	jsonata_node,
	jq_v1_node,
	grid_node,
	count_tokens_node,
	merge_cluster_extraction_node,
	markdown_node,
	stringify_node,
	score_argument_relevance_node,
	gpt_node,
	feedback_node,
	python_node,
	pyodide_node,
	chat_node,
	webpage_node
	// llama_node,
	// argument_extraction_llama_node
];

export async function loadTemplates(): Promise<Record<string, DocumentData>> {
	const q = query(templatesCollection);
	const querySnapshot = await getDocs(q);

	let templates: Record<string, DocumentData> = {};
	querySnapshot.docs.forEach((doc) => {
		templates[doc.id] = doc.data();
	});

	return templates;
}

export async function saveTemplate(name: string, data: any) {
	for (const node of data.nodes) {
		if (!node.data.output) {
			node.data.output = {};
		}
	}
	try {
		const docRef = doc(templatesCollection, name);
		await setDoc(docRef, data);
		console.log(`Template '${name}' successfully updated.`);
	} catch (error) {
		console.error('Error updating template:', error);
	}
}
