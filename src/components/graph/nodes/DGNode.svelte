<script lang="ts">
	import Paper from '@smui/paper';
	import { marked } from 'marked';
	import { docs } from '$lib/node_types';
	import Help from '$lib/icons/HelpCircle.svelte';
	import type { BaseData } from '$lib/node_data_types';
	import { Position, Handle } from '@xyflow/svelte';
	import { dataset } from '$lib/store';
	import Connection from '$lib/icons/Connection.svelte';
	import { useNodes } from '@xyflow/svelte';
	const nodes = useNodes();

	export let data: BaseData;
	export let id: string;
	export let selected: boolean;
	export let style: string = '';

	function onConnect(x) {
		let { source, target } = x.detail.connection;
		$dataset?.graph.onConnect(source, target);
	}

	let dg_node = $dataset?.graph.find(id);
	let show_help = false;
	let has_all_inputs = true;
	$: {
		if (dg_node) {
			$nodes; // trigger reactivity
			selected; // trigger reactivity
			has_all_inputs = dg_node.hasAllInputs;
		}
	}
</script>

<Paper title={id} class={selected ? 'selected-dg-node' : 'dg-node'} {style}>
	{#if data.icon}
		<div style="float: left; margin-right: 0.5rem;" class="w-6 h-6">
			<img
				style="width: 100%; height: 100%; object-fit: contain;"
				src="https://talktothecity.s3.us-west-1.amazonaws.com/tttc-turbo/static/{data.icon}.png"
				class="w-6 h-6"
			/>
		</div>
	{/if}

	<div style="float: right; display: flex; justify-content: flex-end;">
		{#if !has_all_inputs}
			<Connection color="#ffaaaa" class="mr-2" />
		{/if}
		{#if docs[data.compute_type]}
			<button on:click={() => (show_help = !show_help)}><Help color="gray" /></button>
		{/if}
	</div>
	{#if show_help}
		<Paper class="mb-5">
			<div class="docs">{@html marked.parse(docs[data.compute_type])}</div>
		</Paper>
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
