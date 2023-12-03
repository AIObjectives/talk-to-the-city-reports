<script lang="ts">
	import Tab, { Label } from '@smui/tab';
	import TabBar from '@smui/tab-bar';
	import ToolbarNode from './ToolbarNode.svelte';
	import node_categories from '$lib/node_categories';
	import { node_register } from '$lib/templates';

	let tabs = Object.keys(node_categories).map((category) => {
		return {
			label: node_categories[category].label,
			nodes: node_register.filter((node) => node.data.category === category)
		};
	});
	let active = tabs[0];
</script>

<TabBar {tabs} let:tab bind:active>
	<Tab {tab} style="max-height: 25px; overflow-y: hidden;" minWidth>
		<Label style="position: relative; top: -12px;">{tab.label}</Label>
	</Tab>
</TabBar>

<div>
	{#each active.nodes as node (node.id)}
		{#if node.data.icon}
			<ToolbarNode {node} on:click />
		{:else}
			{node.data.label}
		{/if}
	{/each}
</div>
