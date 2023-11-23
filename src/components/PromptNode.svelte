<script lang="ts">
	import { Handle, Position, type NodeProps } from '@xyflow/svelte';
	import TextField from '@smui/textfield';
	import HelperText from '@smui/textfield/helper-text';

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
	export let showSystemPrompt = false;

	const { system_prompt, prompt, output } = data;
</script>

<div class="text-input">
	<div>{data.label}</div>
	{#if showSystemPrompt}
		<TextField
			style="width: 100%;"
			helperLine$style="width: 100% !important;"
			textarea
			input$rows={5}
			value={system_prompt}
			on:input={(evt) => (data.system_prompt = evt.target?.value)}
		>
			<HelperText slot="helper">System extraction prompt</HelperText>
		</TextField>
	{/if}
	<TextField
		style="width: 100%;"
		helperLine$style="width: 100% !important;"
		textarea
		input$rows={5}
		value={prompt}
		on:input={(evt) => (data.prompt = evt.target?.value)}
	>
		<HelperText slot="helper">Primary extraction prompt</HelperText>
	</TextField>
	{#if output}
		<div>Objects: {Object.keys(output).length}: {Object.keys(output)[0]} ...</div>
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
