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

	const { system_prompt, prompt, output } = data;
</script>

<div class="text-input">
	<!-- {#if data.dirty}
		<Close color="red" />
	{:else}
		<Check color="green" />
	{/if} -->
	<div>{data.label}</div>
	<textarea
		rows="4"
		class="nodrag"
		on:input={(evt) => (data.system_prompt = evt.target?.value)}
		value={system_prompt}
	/>
	<textarea
		rows="4"
		class="nodrag"
		on:input={(evt) => (data.prompt = evt.target?.value)}
		value={prompt}
	/>
	{#if output}
		Objects: {Object.keys(output).length}: {Object.keys(output)[0]} ...
	{/if}
	<Handle type="target" position={Position.Top} />
	<Handle type="source" position={Position.Bottom} />
</div>

<style>
	:global(.svelte-flow__node-prompt) {
		font-size: 12px;
		width: 300px;
		background: #eee;
		border: 1px solid #555;
		border-radius: 5px;
		text-align: center;
	}

	.nodrag {
		width: 100%;
	}
</style>
