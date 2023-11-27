import NumberInputNode from '$components/NumberInputNode.svelte';
import TextInputNode from '$components/TextInputNode.svelte';
import PromptNode from '$components/PromptNode.svelte';
import CSVNode from '$components/CSVNode.svelte';
import TranslateNode from '$components/TranslateNode.svelte';
import EditCSVNode from '$components/EditCSVNode.svelte';
import GridNode from '$components/GridNode.svelte';

export const nodeTypes = {
	text_input_v0: TextInputNode,
	prompt_v0: PromptNode,
	csv_v0: CSVNode,
	participant_filter_v0: TextInputNode,
	number_input_v0: NumberInputNode,
	translate_v0: TranslateNode,
	edit_csv_v0: EditCSVNode,
	jsonata_v0: TextInputNode,
	grid_v0: GridNode
};

import { csv } from '$lib/compute/csv';
import { merge } from '$lib/compute/merge';
import { cluster_extraction } from '$lib/compute/cluster_extraction';
import { argument_extraction } from '$lib/compute/argument_extraction';
import { open_ai_key } from '$lib/compute/open_ai_key';
import { report } from '$lib/compute/report';
import { participant_filter } from '$lib/compute/participant_filter';
import { limit_csv } from '$lib/compute/limit_csv';
import { translate } from '$lib/compute/translate';
import { edit_csv } from '$lib/compute/edit_csv';
import { jsonata } from '$lib/compute/jsonata';
import { grid } from '$lib/compute/grid';

export const compute = {
	open_ai_key_v0: open_ai_key,
	csv_v0: csv,
	cluster_extraction_v0: cluster_extraction,
	argument_extraction_v0: argument_extraction,
	report_v0: report,
	participant_filter_v0: participant_filter,
	merge_v0: merge,
	limit_csv_v0: limit_csv,
	translate_v0: translate,
	edit_csv_v0: edit_csv,
	jsonata_v0: jsonata,
	grid_v0: grid
};
