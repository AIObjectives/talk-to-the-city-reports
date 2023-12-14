<script lang="ts">
	import Checkbox from '@smui/checkbox';
	import FormField from '@smui/form-field';
	import { useEdges, useNodes } from '@xyflow/svelte';
	import Select, { Option } from '@smui/select';
	import { Dataset } from '$lib/dataset';
	import { _ as __ } from 'svelte-i18n';

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
		if (node.data.input_ids) {
			const input_edges = $edges
				.filter((edge) => edge.target === node_id)
				.map((edge) => edge.source);
			return input_edges;
		}
		return [];
	}

	function deleteNode() {
		dataset.graph.deleteNode(node_id);
	}
	function deleteEdge() {
		$edges = $edges.filter((edge) => edge.id !== edge_id);
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
				{$__('node')}: {node_id}
			{/if}
			{#if edge}
				$__('edge'): {edge_id}
			{/if}
		</small>
	</p>
	{#if node}
		{#each Object.keys(node.data.input_ids) as key}
			<Select value={node.data.input_ids[key]} label={key}>
				{#each getUnregisteredInput() as input}
					<Option
						value={input}
						on:click={(x) => {
							node.data.input_ids[key] = input;
						}}>{input}</Option
					>
				{/each}
			</Select>
		{/each}
		<div>
			<FormField align="end">
				<div>
					<Checkbox
						checked={node.data.show_in_ui}
						on:change={(x) => {
							node.data.show_in_ui = x.target.checked;
						}}
					/>
				</div>
				<span slot="label">{$__('show_in_standard_view')}</span>
			</FormField>
		</div>
		<hr />
		<button on:click={deleteNode}>{$__('delete_node')}</button>
	{/if}
	{#if edge}
		<hr />
		<button on:click={deleteEdge}>{$__('delete_edge')}</button>
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
