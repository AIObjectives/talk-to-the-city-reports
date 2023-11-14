<script lang="ts">
	import { Handle, Position, type NodeProps } from '@xyflow/svelte';
	import Close from 'svelte-material-icons/Close.svelte';
	import Check from 'svelte-material-icons/Check.svelte';

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
	<!-- {#if dirty}
		<Close color="red" />
	{:else}
		<Check color="green" />
	{/if} -->
	<div>OpenAI Key</div>
	<input
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
