<script lang="ts">
  import type { Writable } from 'svelte/store';
  import type { Node, Edge } from '@xyflow/svelte';
  import { _ as __ } from 'svelte-i18n';

  import { nodeTypes } from '$lib/node_view_types';
  import { useNodes, useEdges } from '@xyflow/svelte';
  import { topologicalSort } from '$lib/utils';

  const nodes: Writable<Node[]> = useNodes();
  const edges: Writable<Edge[]> = useEdges();
</script>

<div class="centered-container" id="pipeline-standard">
  {#each topologicalSort($nodes, $edges) as node (node.id)}
    {#if nodeTypes[node.type]}
      {#if node.data.show_in_ui === undefined || node.data.show_in_ui === true}
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
      {/if}
    {/if}
  {/each}
</div>

<style>
  .centered-container {
    display: flex;
    flex-direction: column; /* Stack elements vertically */
    align-items: center; /* Center children horizontally */
    width: 100%; /* Take full width of the parent container */
    /* `justify-content: flex-start;` to prevent stretch if children are smaller than the max width */
    justify-content: flex-start;
  }

  .p-4 {
    padding: 1rem;
    width: 100%; /* Stretch to the full width of the container */
    max-width: 800px; /* Set the maximum width for child elements */
    box-sizing: border-box; /* Include padding in the width calculation */
    margin-left: auto; /* Margin auto left and right will center the div */
    margin-right: auto;
  }
</style>
