<script lang="ts">
	import { useEdges, useNodes } from '@xyflow/svelte';
	import Select, { Option } from '@smui/select';

	export let onClick: () => void;
	export let id: string;
	export let top: number | undefined;
	export let left: number | undefined;
	export let right: number | undefined;
	export let bottom: number | undefined;

	const nodes = useNodes();
	const edges = useEdges();

	let fruits = ['Apple', 'Orange', 'Banana', 'Mango'];

	let value = 'Orange';

	function duplicateNode() {
		const node = $nodes.find((node) => node.id === id);
		if (node) {
			$nodes.push({
				...node,
				// You should use a better id than this in production
				id: `${id}-copy${Math.random()}`,
				position: {
					x: node.position.x,
					y: node.position.y + 50
				}
			});
		}
		$nodes = $nodes;
	}
	const node = $nodes.find((node) => node.id === id);

	function getUnregisteredInput() {
		if (!node?.data.input_ids) node.data.input_ids = {};
		const input_edges = $edges.filter((edge) => edge.target === id).map((edge) => edge.source);
		return input_edges;
	}

	function deleteNode() {
		$nodes = $nodes.filter((node) => node.id !== id);
		$edges = $edges.filter((edge) => edge.source !== id && edge.target !== id);
	}

	getUnregisteredInput();
	console.log(node.data);
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	style="top: {top}px; left: {left}px; right: {right}px; bottom: {bottom}px; position: fixed;"
	class="context-menu"
>
	<p style="margin: 0.5em;">
		<small>node: {id}</small>
	</p>
	{#each Object.keys(node.data.input_ids) as key}
		<Select bind:value={node.data.input_ids[key]} label={key}>
			{#each getUnregisteredInput() as input}
				<Option value={input}>{input}</Option>
			{/each}
		</Select>
	{/each}

	<hr />
	<button on:click={duplicateNode}>duplicate</button>
	<button on:click={deleteNode}>delete</button>
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
