<script lang="ts">
	import { Handle, Position, type NodeProps } from '@xyflow/svelte';
	import TextField from '@smui/textfield';
	import Paper from '@smui/paper';

	type $$Props = NodeProps;

	export let data: $$Props['data'];

	export let id;
	export let zIndex;
	export let dragging;
	export let dragHandle;
	export let isConnectable;
	export let type;
	export let xPos;
	export let yPos;
	export let selected;
	export let sourcePosition;
	export let targetPosition;

	const { number } = data;
</script>

<Paper title={id}>
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
	<Handle type="target" position={Position.Top} />
	<Handle type="source" position={Position.Bottom} />
</Paper>
