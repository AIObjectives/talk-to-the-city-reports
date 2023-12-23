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

import csv_doc_en from '$lib/docs/csv-en.md?raw';
import csv_doc_zh_TW from '$lib/docs/csv-zh-TW.md?raw';

import limit_csv_doc_en from '$lib/docs/limit_csv-en.md?raw';
import limit_csv_doc_zh_TW from '$lib/docs/limit_csv-zh-TW.md?raw';

import edit_csv_doc_en from '$lib/docs/edit_csv-en.md?raw';
import edit_csv_doc_zh_TW from '$lib/docs/edit_csv-zh-TW.md?raw';

import open_ai_key_doc_en from '$lib/docs/open_ai_key-en.md?raw';
import open_ai_key_doc_zh_TW from '$lib/docs/open_ai_key-zh-TW.md?raw';

import cluster_extraction_doc_en from '$lib/docs/cluster_extraction-en.md?raw';
import cluster_extraction_doc_zh_TW from '$lib/docs/cluster_extraction-zh-TW.md?raw';

import merge_cluster_extraction_doc_en from '$lib/docs/merge_cluster_extraction-en.md?raw';
import merge_cluster_extraction_doc_zh_TW from '$lib/docs/merge_cluster_extraction-zh-TW.md?raw';

import argument_extraction_doc_en from '$lib/docs/argument_extraction-en.md?raw';
import argument_extraction_doc_zh_TW from '$lib/docs/argument_extraction-zh-TW.md?raw';

import grid_doc_en from '$lib/docs/grid-en.md?raw';
import grid_doc_zh_TW from '$lib/docs/grid-zh-TW.md?raw';

import jsonata_doc_en from '$lib/docs/jsonata-en.md?raw';
import jsonata_doc_zh_TW from '$lib/docs/jsonata-zh-TW.md?raw';

import translate_doc_en from '$lib/docs/translate-en.md?raw';
import translate_doc_zh_TW from '$lib/docs/translate-zh-TW.md?raw';

import participant_filter_doc_en from './docs/participant_filter-en.md?raw';
import participant_filter_doc_zh_TW from './docs/participant_filter-zh-TW.md?raw';

import json_doc_en from './docs/json-en.md?raw';
import json_doc_zh_TW from './docs/json-zh-TW.md?raw';

import markdown_doc_en from './docs/markdown-en.md?raw';
import markdown_doc_zh_TW from './docs/markdown-zh-TW.md?raw';

import jq_doc_en from './docs/jq-en.md?raw';
import jq_doc_zh_TW from './docs/jq-zh-TW.md?raw';

import stringify_doc_en from './docs/stringify-en.md?raw';
import stringify_doc_zh_TW from './docs/stringify-zh-TW.md?raw';

import feedback_doc_en from './docs/feedback-en.md?raw';
import feedback_doc_zh_TW from './docs/feedback-zh-TW.md?raw';

export const docs = {
	csv_v0: { en: csv_doc_en, 'zh-TW': csv_doc_zh_TW },
	limit_csv_v0: { en: limit_csv_doc_en, 'zh-TW': limit_csv_doc_zh_TW },
	edit_csv_v0: { en: edit_csv_doc_en, 'zh-TW': edit_csv_doc_zh_TW },
	open_ai_key_v0: { en: open_ai_key_doc_en, 'zh-TW': open_ai_key_doc_zh_TW },
	cluster_extraction_v0: { en: cluster_extraction_doc_en, 'zh-TW': cluster_extraction_doc_zh_TW },
	cluster_extraction_v1: { en: cluster_extraction_doc_en, 'zh-TW': cluster_extraction_doc_zh_TW },
	argument_extraction_v0: {
		en: argument_extraction_doc_en,
		'zh-TW': argument_extraction_doc_zh_TW
	},
	argument_extraction_v1: {
		en: argument_extraction_doc_en,
		'zh-TW': argument_extraction_doc_zh_TW
	},
	grid_v0: { en: grid_doc_en, 'zh-TW': grid_doc_zh_TW },
	jsonata_v0: { en: jsonata_doc_en, 'zh-TW': jsonata_doc_zh_TW },
	jq_v0: { en: jq_doc_en, 'zh-TW': jq_doc_zh_TW },
	translate_v0: { en: translate_doc_en, 'zh-TW': translate_doc_zh_TW },
	participant_filter_v0: { en: participant_filter_doc_en, 'zh-TW': participant_filter_doc_zh_TW },
	merge_cluster_extraction_v0: {
		en: merge_cluster_extraction_doc_en,
		'zh-TW': merge_cluster_extraction_doc_zh_TW
	},
	json_v0: { en: json_doc_en, 'zh-TW': json_doc_zh_TW },
	markdown_v0: { en: markdown_doc_en, 'zh-TW': markdown_doc_zh_TW },
	stringify_v0: { en: stringify_doc_en, 'zh-TW': stringify_doc_zh_TW },
	feedback_v0: { en: feedback_doc_en, 'zh-TW': feedback_doc_zh_TW }
};
