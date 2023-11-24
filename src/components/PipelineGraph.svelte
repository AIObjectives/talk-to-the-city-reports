<script lang="ts">
	import { SvelteFlow, Background, BackgroundVariant } from '@xyflow/svelte';
	import { node_register } from '$lib/templates';
	import ContextMenu from './ContextMenu.svelte';
	import Button from '@smui/button';
	import ContentSaveCogOutline from 'svelte-material-icons/ContentSaveCogOutline.svelte';
	import { saveTemplate } from '$lib/templates';
	import { writable, get } from 'svelte/store';

	export let isGraphView;
	export let nodes;
	export let edges;
	export let nodeTypes;
	let selectedNodeId = '';

	function addNode() {
		let nodeToAdd = node_register.find((node) => node.id === selectedNodeId);
		if (nodeToAdd) {
			nodeToAdd = JSON.parse(JSON.stringify(nodeToAdd));
			nodeToAdd.position.x = 0;
			nodeToAdd.position.y = 0;
			const nodeExists = $nodes.find((node) => node.id === nodeToAdd.id);
			if (nodeExists) {
				const regex = /_\d+$/;
				if (regex.test(nodeExists.id)) {
					const number = parseInt(nodeExists.id.match(regex)[0].slice(1));
					nodeToAdd.id = `${nodeToAdd.id}_${number + 1}`;
				} else {
					nodeToAdd.id = `${nodeToAdd.id}_1`;
				}
			}
			$nodes = [...$nodes, nodeToAdd];
		}
	}

	let menu: { id: string; top?: number; left?: number; right?: number; bottom?: number } | null;

	function handleContextMenu({ detail: { event, node } }) {
		event.preventDefault();
		const transformedPosition = { x: event.clientX, y: event.clientY };
		console.log(transformedPosition);
		menu = {
			id: node.id,
			top: transformedPosition.y,
			left: transformedPosition.x
		};
	}

	function handlePaneClick() {
		menu = null;
	}
</script>

<div>
	{#if isGraphView}
		<button
			on:click={() => {
				const name = prompt('Enter template name');
				const data = { nodes: get(nodes), edges: get(edges) };
				console.log(data);
				saveTemplate(name, data);
			}}
		>
			<ContentSaveCogOutline size="30px" title="Save as template" />
		</button>
		<select bind:value={selectedNodeId} on:change={(x) => addNode(x)}>
			<option value="">add node</option>
			{#each node_register as node}
				<option value={node.id}>{node.id}</option>
			{/each}
		</select>
	{/if}
	<div style:height={isGraphView ? '80vh' : '0vh'}>
		<SvelteFlow
			{nodes}
			{edges}
			{nodeTypes}
			on:nodecontextmenu={handleContextMenu}
			on:paneclick={handlePaneClick}
			elementsSelectable={true}
			preventScrolling={true}
			nodesDraggable={true}
			panOnDrag={true}
			autoPanOnNodeDrag={false}
			zoomOnDoubleClick={false}
			fitView
		>
			<Background variant={BackgroundVariant.Dots} />
		</SvelteFlow>
		{#if menu}
			<ContextMenu
				onClick={handlePaneClick}
				id={menu.id}
				top={menu.top}
				left={menu.left}
				right={menu.right}
				bottom={menu.bottom}
			/>
		{/if}
	</div>
</div>
