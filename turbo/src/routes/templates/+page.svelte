<script lang="ts">
	import '@xyflow/svelte/dist/style.css';
	import { writable, get } from 'svelte/store';
	import { SvelteFlow, type Node, type Edge } from '@xyflow/svelte';
	import { loadTemplates } from '$lib/templates';
	import { Background, BackgroundVariant } from '@xyflow/svelte';
	import { nodeTypes } from '$lib/node_types';
	import { onMount } from 'svelte';
	// import { useSvelteFlow } from '@xyflow/svelte';
	// const { fitView } = useSvelteFlow();

	let nodes = writable<Node[]>();
	let edges = writable<Edge[]>();
	let templates;
	let selectedTemplate;
	onMount(async () => {
		templates = await loadTemplates();
		console.log(templates);
		selectedTemplate = writable(Object.keys(templates)[0]);
	});
	$: {
		if (templates) {
			let template = templates[$selectedTemplate];
			// update nodes
			nodes.set(template.nodes);
			// update edges
			edges.set(template.edges);
		}
	}
</script>

{#if templates}
	<div class="relative inline-flex">
		<select
			bind:value={$selectedTemplate}
			class="rounded border appearance-none border-gray-400 py-2 focus:outline-none focus:border-indigo-500 text-base pl-3 pr-10 w-64"
		>
			{#each Object.keys(templates) as templateKey}
				<option value={templateKey}>{templateKey}</option>
			{/each}
		</select>
	</div>

	<div style:height="80vh">
		<SvelteFlow elementsSelectable={false} {nodes} {edges} {nodeTypes} fitView>
			<Background color="#ccc" variant={BackgroundVariant.Dots} />
		</SvelteFlow>
	</div>
{/if}
