<script lang="ts">
  import { getContext } from 'svelte';
  import { type Writable } from 'svelte/store';
  import DeepCopy from 'deep-copy';

  import { nodeTypes } from '$lib/node_view_types';
  import { node_register } from '$lib/templates';
  import { user } from '$lib/store';
  import { Dataset } from '$lib/dataset';

  import { _ as __ } from 'svelte-i18n';
  import { Background, BackgroundVariant } from '@xyflow/svelte';
  import { useSvelteFlow } from '@xyflow/svelte';
  import { Controls, SvelteFlow } from '@xyflow/svelte';
  import { useNodes } from '@xyflow/svelte';
  import { Panel } from '@xyflow/svelte';
  import { getLayoutedElements, elkOptions } from '$lib/elk';

  import { Tooltip } from 'svelte-ux';

  import ContextMenu from './ContextMenu.svelte';
  import PipelineCreateNodesToolbar from '$components/PipelineCreateNodesToolbar.svelte';
  import ContentSaveOutline from '$lib/icons/ContentSaveOutline.svelte';
  import ContentDuplicate from '$lib/icons/ContentDuplicate.svelte';
  import RobotOutline from '$lib/icons/RobotOutline.svelte';
  import ToolbarNode from './ToolbarNode.svelte';
  import DownloadImage from '$components/graph/DownloadImage.svelte';
  import DotsHorizontal from '$lib/icons/DotsHorizontal.svelte';
  import DotsVertical from '$lib/icons/DotsVertical.svelte';

  export let width = '100%';
  export let height = '97vh';
  export let showNodesToolbar = true;
  export let showSaveButton: boolean = false;
  export let showCopyButton: boolean = false;
  export let autoSave: boolean = false;
  export let showScreenshotButton: boolean = false;
  export let dataset: Dataset;
  export let nodes;
  export let edges;

  const { fitView } = useSvelteFlow();
  const n = useNodes();
  let viewMode = getContext('viewMode') as Writable<string>;
  const { screenToFlowPosition } = useSvelteFlow();
  let active = { nodes: [] };
  let resetTimeout;

  viewMode.subscribe((value) => {
    if (value == 'graph') {
      setTimeout(() => {
        onLayout('RIGHT');
      }, 100);
    }
  });

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

      const matchingNodes = $nodes.filter((node) => node.id.startsWith(nodeToAdd.id + '_'));
      const regex = /_(\d+)$/;

      if (matchingNodes.length > 0) {
        const sortedNodes = matchingNodes.sort((a, b) => {
          const numberA = parseInt(a.id.match(regex)[1]);
          const numberB = parseInt(b.id.match(regex)[1]);
          return numberB - numberA;
        });

        const highestNumber = parseInt(sortedNodes[0].id.match(regex)[1]);
        nodeToAdd.id = `${nodeToAdd.id}_${highestNumber + 1}`;
      } else {
        nodeToAdd.id = `${nodeToAdd.id}_1`;
      }

      $nodes = [...$nodes, nodeToAdd];

      if ($nodes.length == 1) onLayout('RIGHT');
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

  function onLayout(direction: string) {
    const opts = { 'elk.direction': direction, ...elkOptions };
    const ns = $nodes;
    const es = $edges;

    getLayoutedElements(ns, es, opts).then(({ nodes: layoutedNodes, edges: layoutedEdges }) => {
      $nodes = layoutedNodes;
      $edges = layoutedEdges;

      fitView();

      window.requestAnimationFrame(() => fitView());
    });
  }
</script>

<div>
  {#if $viewMode == 'graph' && showNodesToolbar}
    <PipelineCreateNodesToolbar bind:resetTimeout bind:active on:click={(x) => addNode(x.detail)} />
  {/if}
  <div
    style:position={$viewMode == 'graph' ? 'relative' : 'absolute'}
    style:left={$viewMode == 'graph' ? '0' : '-9999px'}
    style:visibility={$viewMode == 'graph' ? 'visible' : 'hidden'}
    style:margin={'auto'}
    style:width
    style:height
    class="noSelect"
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
      elementsSelectable={true}
      preventScrolling={true}
      nodesDraggable={true}
      panOnDrag={true}
      autoPanOnNodeDrag={true}
      zoomOnDoubleClick={false}
      minZoom={0.001}
      class="noSelect"
      style="background: #eeeefa;"
      fitView
    >
      <Background bgColor="#ccc" variant={BackgroundVariant.Dots} />
      <Controls showLock={false} />
      <Panel position="top-right">
        {#if showSaveButton}
          <div class="exec-buttons-top" style="height:42px;">
            <Tooltip title={$__('save_dataset')}>
              <button
                on:click={async () => {
                  await dataset.updateDataset($user);
                }}><ContentSaveOutline size={'30px'} /></button
              >
            </Tooltip>
          </div>
        {/if}
        <div class="exec-buttons-bottom" style="height:42px;">
          <Tooltip title={$__('run_pipeline')}>
            <button
              class="glow-button"
              on:click={async () => {
                await dataset.processNodes('run', $user, autoSave);
                setTimeout(() => {
                  dataset = dataset;
                  $n = $n;
                  for (const node of $n) {
                    node.data = { ...node.data };
                  }
                }, 500);
              }}><RobotOutline size={'30px'} /></button
            >
          </Tooltip>
        </div>
      </Panel>

      <Panel position="bottom-right">
        <Tooltip title={$__('align_horizontally')}>
          <div class="exec-buttons" style="height:42px;">
            <button on:click={() => onLayout('RIGHT')}><DotsHorizontal size="30px" /></button>
          </div>
        </Tooltip>
        <Tooltip title={$__('align_vertically')}>
          <div class="exec-buttons" style="height:42px;">
            <button on:click={() => onLayout('DOWN')}><DotsVertical size="30px" /></button>
          </div>
        </Tooltip>
        {#if showCopyButton}
          <Tooltip title={$__('duplicate_nodes')}>
            <div class="exec-buttons" style="height:42px;">
              <button
                on:click={() => {
                  dataset.graph.duplicateSelectedNodes();
                }}><ContentDuplicate size="30px" /></button
              >
            </div>
          </Tooltip>
        {/if}
        {#if showScreenshotButton}
          <Tooltip title={$__('download_image')}>
            <div class="exec-buttons" style="height:42px;">
              <DownloadImage />
            </div>
          </Tooltip>
        {/if}
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
