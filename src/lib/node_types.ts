import NumberInputNode from '$components/NumberInputNode.svelte';
import TextInputNode from '$components/TextInputNode.svelte';
import PromptNode from '$components/PromptNode.svelte';
import CSVNode from '$components/CSVNode.svelte';
import TranslateNode from '$components/TranslateNode.svelte';
import EditCSVNode from '$components/EditCSVNode.svelte';

export const nodeTypes = {
	text_input_v0: TextInputNode,
	prompt_v0: PromptNode,
	csv_v0: CSVNode,
	participant_filter_v0: TextInputNode,
	number_input_v0: NumberInputNode,
	translate_v0: TranslateNode,
	edit_csv_v0: EditCSVNode
};
