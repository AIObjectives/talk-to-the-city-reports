<script lang="ts">
	import { writable, get } from 'svelte/store';
	import { SvelteFlow, type Node, type Edge } from '@xyflow/svelte';
	import { templates } from '$lib/templates';
	import { Background, BackgroundVariant } from '@xyflow/svelte';
	import '@xyflow/svelte/dist/style.css';
	import TextInputNode from '$components/TextInputNode.svelte';
	import PromptNode from '$components/PromptNode.svelte';
	import CSVNode from '$components/CSVNode.svelte';

	const nodeTypes = {
		'text-input': TextInputNode,
		prompt: PromptNode,
		csv: CSVNode
	};

	let selectedTemplate = writable(Object.keys(templates)[0]);

	let nodes: Node[];
	let edges: Edge[];

	$: {
		let template = templates[$selectedTemplate];
		console.log(template);
		nodes = writable<Node[]>(template.nodes);
		edges = writable<Edge[]>(template.edges);
	}
</script>

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
