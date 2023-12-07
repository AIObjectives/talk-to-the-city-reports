<script lang="ts">
	import { Handle, Position, type NodeProps } from '@xyflow/svelte';
	import TextField from '@smui/textfield';
	import DGNode from './DGNode.svelte';

	type $$Props = NodeProps;

	export let data: $$Props['data'];
	export let id: $$Props['id'];

	const { number } = data;
</script>

<DGNode {data} {id} {...$$restProps}>
	<div>{data.label}</div>
	<TextField
		style="width: 100%;"
		helperLine$style="width: 100%;"
		class="nodrag"
		type="number"
		input$step="1"
		on:input={(evt) => {
			data.number = evt.target?.value;
			data.dirty = true;
		}}
		value={number}
	/>
</DGNode>
