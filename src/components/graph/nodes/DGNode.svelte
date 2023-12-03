<script lang="ts">
	import Paper from '@smui/paper';
	import { marked } from 'marked';
	import { docs } from '$lib/node_types';
	import Help from '$lib/icons/HelpCircle.svelte';
	import type { BaseData } from '$lib/node_data_types';
	import { Position, Handle } from '@xyflow/svelte';
	import { useEdges, useNodes } from '@xyflow/svelte';

	export let data: BaseData;
	export let id: string;
	export let selected: boolean;
	export let style: string = '';
	const nodes = useNodes();

	function onConnect(x) {
		let { source, target } = x.detail.connection;
		source = $nodes.find((n) => n.id === source);
		target = $nodes.find((n) => n.id === target);
		target.data.dirty = true;
		setTimeout(() => {
			$nodes = $nodes;
			for (const node of $nodes) {
				node.data = { ...node.data };
			}
		}, 500);
	}

	let show_help = false;
</script>

<Paper title={id} class={selected ? 'selected-dg-node' : 'dg-node'} {style}>
	{#if docs[data.compute_type]}
		<button on:click={() => (show_help = !show_help)} style="float: right;"
			><Help color="gray" /></button
		>
		{#if show_help}
			<Paper class="mb-5">
				<div class="docs">{@html marked.parse(docs[data.compute_type])}</div>
			</Paper>
		{/if}
	{/if}
	<slot />
	{#if data && data.dirty}
		<div class="text-sm text-gray-500">Unsaved changes</div>
	{/if}
	{#if data && data.message}
		<div class="text-sm text-gray-500">{data.message}</div>
	{/if}

	<Handle type="source" position={Position.Bottom} on:connect={onConnect} />
	<Handle type="target" position={Position.Top} on:connect={onConnect} />
</Paper>
