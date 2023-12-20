import NumberInputNode from '$components/graph/nodes/NumberInputNode.svelte';
import TextInputNode from '$components/graph/nodes/TextInputNode.svelte';
import PromptNode from '$components/graph/nodes/PromptNode.svelte';
import CSVNode from '$components/graph/nodes/CSVNode.svelte';
import JSONNode from '$components/graph/nodes/JSONNode.svelte';
import TranslateNode from '$components/graph/nodes/TranslateNode.svelte';
import EditCSVNode from '$components/graph/nodes/EditCSVNode.svelte';
import GridNode from '$components/graph/nodes/GridNode.svelte';
import MarkdownNode from '$components/graph/nodes/MarkdownNode.svelte';
import DefaultNode from '$components/graph/nodes/DefaultNode.svelte';
import CodeMirrorNode from '$components/graph/nodes/CodeMirrorNode.svelte';

export const nodeTypes = {
	text_input_v0: TextInputNode,
	prompt_v0: PromptNode,
	csv_v0: CSVNode,
	json_v0: JSONNode,
	participant_filter_v0: TextInputNode,
	number_input_v0: NumberInputNode,
	translate_v0: TranslateNode,
	edit_csv_v0: EditCSVNode,
	jsonata_v0: CodeMirrorNode,
	jq_v0: CodeMirrorNode,
	jq_v1: CodeMirrorNode,
	grid_v0: GridNode,
	markdown_v0: MarkdownNode,
	default_v0: DefaultNode,
	default: DefaultNode,
	merge_v0: DefaultNode,
	stringify_v0: DefaultNode,
	feedback_v0: DefaultNode,
	gpt_v0: PromptNode,
	// python_v0: TextInputNode,
	pyodide_v0: CodeMirrorNode,
	report_v0: DefaultNode,
	report_v1: DefaultNode
};

import '$lib/compute/csv';
import '$lib/compute/merge';
import '$lib/compute/cluster_extraction_v0';
import '$lib/compute/cluster_extraction_v1';
import '$lib/compute/argument_extraction_v0';
import '$lib/compute/open_ai_key';
import '$lib/compute/report_v0';
import '$lib/compute/report_v1';
import '$lib/compute/participant_filter';
import '$lib/compute/limit_csv';
import '$lib/compute/translate';
import '$lib/compute/edit_csv';
import '$lib/compute/jsonata';
import '$lib/compute/jq_v0';
import '$lib/compute/jq_v1';
import '$lib/compute/grid';
import '$lib/compute/count_tokens';
import '$lib/compute/merge_cluster_extraction';
import '$lib/compute/json';
import '$lib/compute/markdown';
import '$lib/compute/stringify';
import '$lib/compute/score_argument_relevance';
import '$lib/compute/gpt';
import '$lib/compute/score_argument_relevance';
// import '$lib/compute/python';
import '$lib/compute/pyodide';
// import './compute/llama';
// import './compute/argument_extraction_llama';

import csv_doc from '$lib/docs/csv';
import limit_csv_doc from '$lib/docs/limit_csv';
import edit_csv_doc from '$lib/docs/edit_csv';
import open_ai_key_doc from '$lib/docs/open_ai_key';
import cluster_extraction_doc from '$lib/docs/cluster_extraction';
import merge_cluster_extraction_doc from '$lib/docs/merge_cluster_extraction';
import argument_extraction_doc from '$lib/docs/argument_extraction';
import grid_doc from '$lib/docs/grid';
import jsonata_doc from '$lib/docs/jsonata';
import translate_doc from '$lib/docs/translate';
import participant_filter_doc from './docs/participant_filter';
import json_doc from './docs/json';
import markdown_doc from './docs/markdown';
import jq_doc from './docs/jq';
import stringify_doc from './docs/stringify';

export const docs = {
	csv_v0: csv_doc,
	limit_csv_v0: limit_csv_doc,
	edit_csv_v0: edit_csv_doc,
	open_ai_key_v0: open_ai_key_doc,
	cluster_extraction_v0: cluster_extraction_doc,
	cluster_extraction_v1: cluster_extraction_doc,
	argument_extraction_v0: argument_extraction_doc,
	grid_v0: grid_doc,
	jsonata_v0: jsonata_doc,
	jq_v0: jq_doc,
	translate_v0: translate_doc,
	participant_filter_v0: participant_filter_doc,
	merge_cluster_extraction_v0: merge_cluster_extraction_doc,
	json_v0: json_doc,
	markdown_v0: markdown_doc,
	stringify_v0: stringify_doc
};
