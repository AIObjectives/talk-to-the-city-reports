<script lang="ts">
	import { type NodeProps } from '@xyflow/svelte';
	import DGNode from './DGNode.svelte';
	import GridNested from '$components/GridNested.svelte';

	type $$Props = NodeProps;

	export let data: $$Props['data'];
	export let id: $$Props['id'];
	export let isStandardView: $$Props['isStandardView'];
</script>

<DGNode {id} {data} {...$$restProps} style="">
	<div>{data.label}</div>
	{#if data && data.output}
		<GridNested data={data.output} {id} {isStandardView} />
	{/if}
</DGNode>

<style>
	.grid {
		min-width: 500px;
		min-height: 300px;
		max-height: 300px;
	}
</style>
