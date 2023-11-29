<script lang="ts">
	import { useEdges, useNodes } from '@xyflow/svelte';
	import Select, { Option } from '@smui/select';
	import { Dataset } from '$lib/dataset';

	export let onClick: () => void;
	export let edge_id: string | undefined;
	export let node_id: string | undefined;
	export let top: number | undefined;
	export let left: number | undefined;
	export let right: number | undefined;
	export let bottom: number | undefined;
	export let dataset: Dataset;

	const nodes = useNodes();
	const edges = useEdges();

	const node = node_id ? $nodes.find((node) => node.id === node_id) : undefined;
	const edge = edge_id ? $edges.filter((edge) => edge.id === edge_id) : undefined;

	function getUnregisteredInput() {
		if (!node?.data.input_ids) node.data.input_ids = {};
		const input_edges = $edges.filter((edge) => edge.target === node_id).map((edge) => edge.source);
		return input_edges;
	}

	function deleteNode() {
		dataset.graph.deleteNode(node_id);
	}
	function deleteEdge() {
		$edges = $edges.filter((edge) => edge.id !== node_id);
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	style="top: {top}px; left: {left}px; right: {right}px; bottom: {bottom}px; position: fixed;"
	class="context-menu"
>
	<p style="margin: 0.5em;">
		<small
			>{#if node}
				node: {node_id}
			{/if}
			{#if edge}
				edge: {edge_id}
			{/if}
		</small>
	</p>
	{#if node}
		{#each Object.keys(node.data.input_ids) as key}
			<Select bind:value={node.data.input_ids[key]} label={key}>
				{#each getUnregisteredInput() as input}
					<Option value={input}>{input}</Option>
				{/each}
			</Select>
		{/each}

		<hr />
		<button on:click={deleteNode}>delete node</button>
	{/if}
	{#if edge}
		<hr />
		<button on:click={deleteEdge}>delete edge</button>
	{/if}
</div>

<style>
	.context-menu {
		background: white;
		border-style: solid;
		box-shadow: 10px 19px 20px rgba(0, 0, 0, 10%);
		position: absolute;
		z-index: 10;
	}

	.context-menu button {
		border: none;
		display: block;
		padding: 0.5em;
		text-align: left;
		width: 100%;
	}

	.context-menu button:hover {
		background: white;
	}
</style>
