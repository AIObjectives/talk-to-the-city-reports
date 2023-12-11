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
	import RobotOutline from '$lib/icons/RobotOutline.svelte';
	import { useNodes } from '@xyflow/svelte';
	const n = useNodes();

	import { Panel } from '@xyflow/svelte';
	import DownloadImage from '$components/graph/DownloadImage.svelte';

	const { screenToFlowPosition } = useSvelteFlow();

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
	{#if $viewMode == 'graph' || $viewMode == 'dual'}
		<PipelineCreateNodesToolbar on:click={(x) => addNode(x.detail)} />
	{/if}
	<div
		style:width={$viewMode == 'graph' || $viewMode == 'dual' ? '100%' : '0vw'}
		style:height={'97vh'}
		class="flow-container"
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
			deleteKey={{ key: 'Backspace', modifier: 'meta' }}
			ondelete={(e) => {
				for (const node of e.nodes) {
					const dg_node = new DGNode(node, dataset.graph);
					dg_node.deleteAssets();
					// for (const edge of e.edges) {
					// 	if (edge.source === node.id) {
					// 		const target_node = dataset.graph.find(edge.target);
					// 		target_node.node.data.input_data = {};
					// 	}
					// }
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
						on:click={async () => {
							await dataset.processNodes('run', $user);
							setTimeout(() => {
								dataset = dataset;
								console.log('refresh');
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
				<div class="exec-buttons" style="height:42px;"><DownloadImage /></div>
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
	.exec-buttons-top {
		background-color: #f8f8f8;
		border: solid;
		border-width: 1px;
		border-bottom-width: 0.5px;
		border-radius: 2%;
		border-color: #ddd;
		padding: 4px;
		margin: 0px;
	}
	.exec-buttons {
		background-color: #f8f8f8;
		border: solid;
		border-top-width: 1px;
		border-radius: 2%;
		border-color: #ddd;
		padding: 4px;
		margin: 0px;
	}
	.exec-buttons-bottom {
		background-color: #f8f8f8;
		border: solid;
		border-top-width: 0.5px;
		border-width: 1px;
		border-radius: 2%;
		border-color: #ddd;
		padding: 4px;
		margin: 0px;
	}
</style>
