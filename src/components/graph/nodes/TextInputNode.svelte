<script lang="ts">
	import { type NodeProps } from '@xyflow/svelte';
	import TextField from '@smui/textfield';
	import DGNode from './DGNode.svelte';
	import _ from 'lodash';

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

	const { text } = data;
	console.log(data.compute_type);
</script>

<DGNode {data} {id} {selected}>
	<div>{data.label}</div>
	{#if _.includes(['jq_v1', 'jsonata_v0'], data.compute_type)}
		<TextField
			style="width: 100%; min-width: 400px;"
			helperLine$style="width: 100%;"
			class="nodrag"
			type="text"
			textarea
			input$rows={6}
			on:input={(evt) => {
				data.text = evt.target?.value;
				data.dirty = true;
			}}
			value={text}
		/>
	{:else}
		<TextField
			style="width: 100%;"
			helperLine$style="width: 100%;"
			class="nodrag"
			type="text"
			on:input={(evt) => {
				data.text = evt.target?.value;
				data.dirty = true;
			}}
			value={text}
		/>
	{/if}
</DGNode>
