<script lang="ts">
	import { Controls, SvelteFlow } from '@xyflow/svelte';
	import { nodeTypes } from '$lib/node_types';
	import { node_register } from '$lib/templates';
	import ContextMenu from './ContextMenu.svelte';
	import { Dataset } from '$lib/dataset';
	import { DGNode } from '$lib/node';
	import DeepCopy from 'deep-copy';
	import PipelineCreateNodesToolbar from '$components/PipelineCreateNodesToolbar.svelte';
	import { user } from '$lib/store';
	import { useSvelteFlow } from '@xyflow/svelte';
	import { viewMode } from '$lib/store';
	import ContentSaveOutline from '$lib/icons/ContentSaveOutline.svelte';
	import ContentDuplicate from '$lib/icons/ContentDuplicate.svelte';
	import RobotOutline from '$lib/icons/RobotOutline.svelte';
	import { useNodes } from '@xyflow/svelte';
	import ToolbarNode from './ToolbarNode.svelte';
	const n = useNodes();

	import { Panel } from '@xyflow/svelte';
	import DownloadImage from '$components/graph/DownloadImage.svelte';

	const { screenToFlowPosition } = useSvelteFlow();

	let resetTimeout;
	export let dataset: Dataset;
	export let nodes;
	export let edges;
	let active = { nodes: [] };

	const onDragOver = (event: DragEvent) => {
		event.preventDefault();
		if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
	};

	function addNode(event: DragEvent) {
		event.preventDefault();
		if (!event.dataTransfer) return null;

		const type = event.dataTransfer.getData('application/svelteflow');

		const position = screenToFlowPosition({
			x: event.clientX,
			y: event.clientY
		});

		let nodeToAdd = node_register.find((node) => node.data.compute_type === type);

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
	{#if $viewMode == 'graph'}
		<PipelineCreateNodesToolbar bind:resetTimeout bind:active on:click={(x) => addNode(x.detail)} />
	{/if}
	<div
		style:visibility={$viewMode == 'graph' ? 'visible' : 'hidden'}
		style:height={$viewMode == 'graph' ? '97vh' : '100%'}
		class="flow-container noSelect"
	>
		<SvelteFlow
			{nodes}
			{edges}
			{nodeTypes}
			on:nodecontextmenu={handleContextMenu}
			on:edgecontextmenu={handleEdgeContextMenu}
			on:paneclick={handlePaneClick}
			on:dragover={onDragOver}
			on:drop={addNode}
			deleteKey={''}
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
			minZoom={0.001}
			class="noSelect"
			fitView
		>
			<Controls showLock={false} />
			<Panel position="top-right">
				<div class="exec-buttons-top" style="height:42px;">
					<button
						on:click={async () => {
							await dataset.updateDataset($user);
						}}><ContentSaveOutline size={30} /></button
					>
				</div>
				<div class="exec-buttons-bottom" style="height:42px;">
					<button
						class="glow-button"
						on:click={async () => {
							await dataset.processNodes('run', $user);
							setTimeout(() => {
								dataset = dataset;
								$n = $n;
								for (const node of $n) {
									node.data = { ...node.data };
								}
							}, 500);
						}}><RobotOutline size={30} /></button
					>
				</div>
			</Panel>

			<Panel position="bottom-right">
				<div class="exec-buttons" style="height:42px;">
					<button
						on:click={() => {
							dataset.graph.duplicateSelectedNodes();
						}}><ContentDuplicate size="30px" /></button
					>
				</div>
				<div class="exec-buttons" style="height:42px;"><DownloadImage /></div>
			</Panel>

			<Panel position="top-left">
				{#each active.nodes as node (node.data.compute_type)}
					<ToolbarNode {node} {resetTimeout} />
				{/each}
			</Panel>
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
	.noSelect {
		user-select: none;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
	}
	.glow-button {
		border: none;
		outline: none;
		cursor: pointer;
		transition: box-shadow 0.3s ease;
	}

	.glow-button:hover {
		box-shadow: 0 0 10px #ffffff, 0 0 20px #ffffff, 0 0 30px #ffffff, 0 0 20px #ffffff;
	}
</style>
