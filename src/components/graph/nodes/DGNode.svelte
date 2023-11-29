<script lang="ts">
	import Paper from '@smui/paper';
	import { marked } from 'marked';
	import { docs } from '$lib/node_types';
	import Help from 'svelte-material-icons/HelpCircle.svelte';
	import type { BaseData } from '$lib/node_data_types';

	export let data: BaseData;
	export let id: string;
	export let selected: boolean;
	export let style: string = '';

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
</Paper>
