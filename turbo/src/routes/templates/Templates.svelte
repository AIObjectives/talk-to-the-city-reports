<script lang="ts">
  import { Button } from 'svelte-ux';
  import '@xyflow/svelte/dist/style.css';
  import _ from 'lodash';
  import { writable } from 'svelte/store';
  import { success } from '$components/toast/theme';
  import { SvelteFlow, type Node, type Edge } from '@xyflow/svelte';
  import { loadTemplates } from '$lib/templates';
  import { Background, BackgroundVariant } from '@xyflow/svelte';
  import { nodeTypes } from '$lib/node_view_types';
  import { onMount } from 'svelte';
  import { _ as __ } from 'svelte-i18n';
  import SaveJSONAsTemplate from './SaveJSONAsTemplate.svelte';
  import { useSvelteFlow } from '@xyflow/svelte';
  import { getLayoutedElements, elkOptions } from '$lib/elk';

  const { fitView } = useSvelteFlow();

  let nodes = writable<Node[]>();
  let edges = writable<Edge[]>();
  let templates;
  let selectedTemplate;
  let open = false;

  onMount(async () => {
    templates = await loadTemplates();
    selectedTemplate = writable(Object.keys(templates)[0]);
  });

  $: {
    if (templates) {
      let template = templates[$selectedTemplate];
      if (template) {
        // update nodes
        nodes.set(template.nodes);
        // update edges
        edges.set(template.edges);
      }
      fitView();
      onLayout('RIGHT');
    }
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

<Button
  style="max-width: 200px;"
  on:click={() => {
    open = true;
  }}>Save JSON as template</Button
>

<SaveJSONAsTemplate bind:open />

{#if _.keys(templates)?.length > 0}
  <div class="relative inline-flex">
    <select
      bind:value={$selectedTemplate}
      class="rounded border appearance-none border-gray-400 py-2 focus:outline-none focus:border-indigo-500 text-base pl-3 pr-10 w-64"
    >
      {#each Object.keys(templates) as templateKey}
        <option value={templateKey}>{templateKey}</option>
      {/each}
    </select>
    &nbsp;&nbsp;&nbsp;
    <Button
      on:click={() => {
        const template = templates[$selectedTemplate];
        const jsonString = JSON.stringify(template, null, 2);
        navigator.clipboard.writeText(jsonString);
        success('Template copied to clipboard');
      }}>Copy template to clipboard</Button
    >
    &nbsp;&nbsp;&nbsp;
  </div>

  <div style:height="70vh">
    <SvelteFlow minZoom={0} elementsSelectable={false} {nodes} {edges} {nodeTypes} fitView>
      <Background color="#888" variant={BackgroundVariant.Dots} />
    </SvelteFlow>
  </div>
{/if}
