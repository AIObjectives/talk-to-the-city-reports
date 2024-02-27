<script lang="ts">
  import type { Writable } from 'svelte/store';
  import type { Node, Edge } from '@xyflow/svelte';
  import { _ as __ } from 'svelte-i18n';
  import { user } from '$lib/store';
  import type { Dataset } from '$lib/dataset';

  import { nodeTypes } from '$lib/node_view_types';
  import { useNodes, useEdges } from '@xyflow/svelte';
  import { topologicalSort } from '$lib/utils';

  export let dataset: Dataset;
  export let showPipeline: boolean = false;
  export let standardHasNodes: boolean = false;

  const nodes: Writable<Node[]> = useNodes();
  const edges: Writable<Edge[]> = useEdges();

  let filtered = [];

  $: {
    let sorted = topologicalSort($nodes, $edges);
    filtered = [];
    for (const node of sorted) {
      const show_in_ui = node.data.show_in_ui === undefined || node.data.show_in_ui === true;
      const show_to_anon = node.data.show_to_anon === true;
      if (nodeTypes[node.type])
        if (showPipeline || (dataset?.owner == $user?.uid && show_in_ui) || show_to_anon)
          filtered.push(node);
    }
    standardHasNodes = filtered.length > 0;
  }
</script>

<div class="centered-container" id="pipeline-standard">
  {#each filtered as node (node.id)}
    <div class="p-4">
      <svelte:component
        this={nodeTypes[node.type]}
        data={node.data}
        id={node.id}
        zIndex={node.zIndex}
        dragging={node.dragging}
        dragHandle={node.dragHandle}
        isConnectable={node.isConnectable}
        type={node.type}
        xPos={node.xPos}
        yPos={node.yPos}
        position={node.position}
        positionAbsolute={node.positionAbsolute}
        width={node.width}
        height={node.height}
        selected={node.selected}
        sourcePosition={node.sourcePosition}
        targetPosition={node.targetPosition}
        isStandardView={true}
      />
    </div>
  {/each}
</div>

<style>
  .centered-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    justify-content: flex-start;
  }

  .p-4 {
    padding: 1rem;
    width: 100%;
    max-width: 800px;
    box-sizing: border-box;
    margin-left: auto;
    margin-right: auto;
  }
</style>
