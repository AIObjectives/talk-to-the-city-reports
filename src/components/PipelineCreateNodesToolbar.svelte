<script lang="ts">
	import { onMount } from 'svelte';
	import Tab, { Label } from '@smui/tab';
	import TabBar from '@smui/tab-bar';
	import ToolbarNode from './ToolbarNode.svelte';
	import node_categories from '$lib/node_categories';
	import { node_register } from '$lib/templates';
	import { _ } from 'lodash';

	let tabs = Object.keys(node_categories).map((category) => {
		return {
			label: node_categories[category].label,
			nodes: node_register.filter((node) => node.data.category === category)
		};
	});
	let active = tabs[0];
	let nodes = [];

	onMount(() => {
		let top = 0;
		if (nodes) {
			nodes.forEach((node, i) => {
				node.style.top = `${top}px`;
				top += node.offsetHeight + 10;
			});
		}
	});

	let draw = false;
	$: {
		draw = false;
		active = tabs.find((t) => t.label === active.label);
		let top = 30;
		if (nodes) {
			nodes.forEach((node, i) => {
				if (node) {
					node.style.top = `${top}px`;
					top += node.offsetHeight + 10;
				}
			});
		}
		draw = true;
	}
</script>

<div class="toolbar">
	<TabBar {tabs} let:tab bind:active>
		<Tab {tab} style="max-height: 25px;  overflow: hidden;" minWidth>
			<Label style="position: relative; top: -12px;">{tab.label}</Label>
		</Tab>
	</TabBar>
</div>

{#if draw}
	{#each active.nodes as node, i (node.id)}
		<div class="toolbar-node floating-toolbar-node" bind:this={nodes[i]}>
			<ToolbarNode {node} on:click />
		</div>
	{/each}
{/if}

<style>
	.toolbar {
		border-bottom: 1px solid #ccc !important;
	}
	.floating-toolbar-node {
		z-index: 100000;
		position: fixed;
		left: 0;
	}
</style>
