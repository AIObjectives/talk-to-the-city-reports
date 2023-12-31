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
import ChatNode from '$components/graph/nodes/ChatNode.svelte';

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
	report_v1: DefaultNode,
	chat_v0: ChatNode,
	webpage_v0: TextInputNode
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
import '$lib/compute/webpage';
// import '$lib/compute/python';
import '$lib/compute/pyodide';
// import './compute/llama';
// import './compute/argument_extraction_llama';
