<script lang="ts">
	import { NodeToolbar, Handle, Position, type NodeProps, useEdges } from '@xyflow/svelte';
	import TextField from '@smui/textfield';
	import HelperText from '@smui/textfield/helper-text';
	import Paper from '@smui/paper';

	const edges = useEdges();
	type $$Props = NodeProps;

	export let data: $$Props['data'];

	export let id: $$Props['id'];
	export let zIndex;
	export let dragging;
	export let dragHandle;
	export let type;
	export let xPos;
	export let yPos;
	export let selected;
	export let sourcePosition;
	export let targetPosition;
	export let showSystemPrompt = false;

	const { system_prompt, prompt, output } = data;
</script>

<!-- <NodeToolbar>
	<input type="text" bind:value={data.label} />
</NodeToolbar> -->

<Paper>
	<div>{data.label}</div>
	{#if showSystemPrompt}
		<TextField
			style="width: 100%;"
			helperLine$style="width: 100% !important;"
			textarea
			input$rows={5}
			value={system_prompt}
			on:input={(evt) => {
				data.system_prompt = evt.target?.value;
				data.dirty = true;
			}}
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
		on:input={(evt) => {
			data.prompt = evt.target?.value;
			data.dirty = true;
		}}
	>
		<HelperText slot="helper">Primary extraction prompt</HelperText>
	</TextField>
	{#if output}
		<div>Objects: {Object.keys(output).length}: {Object.keys(output)[0]} ...</div>
	{/if}
	{#if data.dirty}
		<div class="text-sm text-gray-500">Unsaved changes</div>
	{/if}
	<Handle type="target" position={Position.Top} />
	<Handle type="source" position={Position.Bottom} />
</Paper>
