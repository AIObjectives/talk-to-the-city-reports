<script lang="ts">
	import { Handle, Position, type NodeProps } from '@xyflow/svelte';
	import TextField from '@smui/textfield';

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

	let dirty = true;
	const { text } = data;
	$: dirty: data.dirty;
</script>

<div class="text-input">
	<div>OpenAI Key</div>
	<TextField
		style="width: 100%;"
		helperLine$style="width: 100%;"
		class="nodrag"
		type="text"
		on:input={(evt) => (data.text = evt.target?.value)}
		value={text}
	/>
	<Handle type="source" position={Position.Right} />
</div>

<style>
	:global(.svelte-flow__node-text-input) {
		font-size: 12px;
		background: #eee;
		border: 1px solid #555;
		border-radius: 5px;
		text-align: center;
	}
</style>
