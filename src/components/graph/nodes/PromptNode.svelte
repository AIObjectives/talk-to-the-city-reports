<script lang="ts">
	import { Handle, Position, type NodeProps } from '@xyflow/svelte';
	import TextField from '@smui/textfield';
	import HelperText from '@smui/textfield/helper-text';
	import DGNode from './DGNode.svelte';
	import Checkbox from '@smui/checkbox';
	import FormField from '@smui/form-field';

	type $$Props = NodeProps;

	export let data: $$Props['data'];
	export let id: $$Props['id'];
	export let zIndex: $$Props['zIndex'];
	export let dragging: $$Props['dragging'];
	export let dragHandle: $$Props['dragHandle'];
	export let isConnectable: $$Props['isConnectable'];
	export let type: $$Props['type'];
	export let positionAbsolute: $$Props['positionAbsolute'];
	export let width: $$Props['width'];
	export let height: $$Props['height'];
	export let selected: $$Props['selected'];
	export let sourcePosition: $$Props['sourcePosition'];
	export let targetPosition: $$Props['targetPosition'];
	export let isStandardView: boolean;

	export let showSystemPrompt = false;

	const { system_prompt, prompt, output } = data;
</script>

<DGNode {id} {data} {selected} style={isStandardView ? '' : 'min-width: 500px; min-height: 400px;'}>
	<div>{data.label}</div>
	<FormField align="end">
		<span><Checkbox bind:checked={showSystemPrompt} /></span>
		<span slot="label">Show system prompt.</span>
	</FormField>
	{#if showSystemPrompt}
		<TextField
			style="width: 100%; overflow: auto"
			helperLine$style="width: 100% !important;"
			class="nowheel"
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
		style="width: 100%; overflow: auto"
		class="nowheel"
		helperLine$style="width: 100% !important;"
		textarea
		input$rows={12}
		value={prompt}
		on:input={(evt) => {
			data.prompt = evt.target?.value;
			data.dirty = true;
		}}
	>
		<HelperText slot="helper">Primary extraction prompt</HelperText>
	</TextField>
	{#if output && Object.keys(output).length}
		<div>Objects: {Object.keys(output).length}: {Object.keys(output)[0]} ...</div>
	{/if}
</DGNode>
