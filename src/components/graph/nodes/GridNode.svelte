<script lang="ts">
	import { type NodeProps } from '@xyflow/svelte';
	import DGNode from './DGNode.svelte';
	import GridNested from '$components/GridNested.svelte';

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
</script>

<DGNode {id} {data} {selected}>
	<div>{data.label}</div>
	{#if data && data.output}
		<GridNested data={data.output} />
	{/if}
</DGNode>

<style>
	.grid {
		min-width: 500px;
		min-height: 300px;
		max-height: 300px;
	}
</style>
