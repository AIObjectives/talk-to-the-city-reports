<script lang="ts">
	import type { Writable } from 'svelte/store';
	import type { Node, Edge } from '@xyflow/svelte';

	import { nodeTypes } from '$lib/node_types';
	import { useNodes, useEdges } from '@xyflow/svelte';
	import { topologicalSort } from '$lib/utils';

	const nodes: Writable<Node[]> = useNodes();
	const edges: Writable<Edge[]> = useEdges();
</script>

{#each topologicalSort($nodes, $edges) as node (node.id)}
	{#if nodeTypes[node.type]}
		<div class="p-4">
			<svelte:component
				this={nodeTypes[node.type]}
				bind:data={node.data}
				bind:id={node.id}
				bind:zIndex={node.zIndex}
				bind:dragging={node.dragging}
				bind:dragHandle={node.dragHandle}
				bind:isConnectable={node.isConnectable}
				bind:type={node.type}
				bind:xPos={node.xPos}
				bind:yPos={node.yPos}
				bind:positionAbsolute={node.positionAbsolute}
				bind:width={node.width}
				bind:height={node.height}
				bind:selected={node.selected}
				bind:sourcePosition={node.sourcePosition}
				bind:targetPosition={node.targetPosition}
				isStandardView={true}
			/>
		</div>
	{/if}
{/each}
