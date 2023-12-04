<script lang="ts">
	import { SvelteFlow, Background, BackgroundVariant } from '@xyflow/svelte';
	import { nodeTypes } from '$lib/node_types';
	import { node_register } from '$lib/templates';
	import ContextMenu from './ContextMenu.svelte';
	import ContentSaveCogOutline from '$lib/icons/ContentSaveCogOutline.svelte';
	import { saveTemplate } from '$lib/templates';
	import { get } from 'svelte/store';
	import { Dataset } from '$lib/dataset';
	import { DGNode } from '$lib/node';
	import { user } from '$lib/store';
	import DeepCopy from 'deep-copy';
	import PipelineCreateNodesToolbar from '$components/PipelineCreateNodesToolbar.svelte';
	import { useSvelteFlow } from '@xyflow/svelte';

	const { screenToFlowPosition, getViewport, flowToScreenPosition } = useSvelteFlow();

	export let isGraphView: boolean;
	export let dataset: Dataset;
	export let nodes;
	export let edges;

	const onDragOver = (event: DragEvent) => {
		event.preventDefault();
		if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
	};

	function addNode(event: DragEvent) {
		event.preventDefault();
		if (!event.dataTransfer) return null;

		const type = event.dataTransfer.getData('application/svelteflow');
		console.log(type);

		const position = screenToFlowPosition({
			x: event.clientX,
			y: event.clientY
		});

		let nodeToAdd = node_register.find((node) => node.id === type);

		if (nodeToAdd) {
			nodeToAdd = DeepCopy(nodeToAdd);
			nodeToAdd.position = position;

			// Finding all matching nodes and sorting them
			const matchingNodes = $nodes.filter((node) => node.id.startsWith(nodeToAdd.id + '_'));
			const regex = /_(\d+)$/;

			if (matchingNodes.length > 0) {
				const sortedNodes = matchingNodes.sort((a, b) => {
					const numberA = parseInt(a.id.match(regex)[1]);
					const numberB = parseInt(b.id.match(regex)[1]);
					return numberB - numberA;
				});

				// Increment the highest number found
				const highestNumber = parseInt(sortedNodes[0].id.match(regex)[1]);
				nodeToAdd.id = `${nodeToAdd.id}_${highestNumber + 1}`;
			} else {
				// If no matching nodes, append _1
				nodeToAdd.id = `${nodeToAdd.id}_1`;
			}

			$nodes = [...$nodes, nodeToAdd];
		}
	}

	let menu: {
		edge_id?: string;
		node_id?: string;
		top?: number;
		left?: number;
		right?: number;
		bottom?: number;
	} | null;

	function handleContextMenu({ detail: { event, node } }) {
		event.preventDefault();
		const transformedPosition = { x: event.clientX, y: event.clientY };
		menu = {
			node_id: node.id,
			top: transformedPosition.y,
			left: transformedPosition.x
		};
	}

	function handleEdgeContextMenu({ detail: { event, edge } }) {
		event.preventDefault();
		const transformedPosition = { x: event.clientX, y: event.clientY };
		menu = {
			edge_id: edge.id,
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
		{#if $user.uid == 'H6U6UUpCtqb5pRvRc9BalA5eNWP2'}
			<button
				on:click={() => {
					const name = prompt('Enter template name');
					const data = { nodes: get(nodes), edges: get(edges) };
					saveTemplate(name, data);
				}}
			>
				<ContentSaveCogOutline size="30px" title="Save as template" />
			</button>
		{/if}
		<PipelineCreateNodesToolbar on:click={(x) => addNode(x.detail)} />
	{/if}
	<div style:height={isGraphView ? '80vh' : '0vh'} class="flow-container">
		<SvelteFlow
			{nodes}
			{edges}
			{nodeTypes}
			on:nodecontextmenu={handleContextMenu}
			on:edgecontextmenu={handleEdgeContextMenu}
			on:paneclick={handlePaneClick}
			on:dragover={onDragOver}
			on:drop={addNode}
			ondelete={(e) => {
				for (const node of e.nodes) {
					const dg_node = new DGNode(node, dataset.graph);
					dg_node.deleteAssets();
				}
			}}
			elementsSelectable={true}
			preventScrolling={true}
			nodesDraggable={true}
			panOnDrag={true}
			autoPanOnNodeDrag={true}
			zoomOnDoubleClick={false}
			minZoom={0.1}
			fitView
		>
			<Background variant={BackgroundVariant.Dots} />
		</SvelteFlow>
		{#if menu}
			<ContextMenu
				onClick={handlePaneClick}
				edge_id={menu.edge_id}
				node_id={menu.node_id}
				top={menu.top}
				left={menu.left}
				right={menu.right}
				bottom={menu.bottom}
				{dataset}
			/>
		{/if}
	</div>
</div>

<style>
	.flow-container {
		border-color: #aaa;
		border-width: 1px;
	}
</style>
