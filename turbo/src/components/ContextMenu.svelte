<script lang="ts">
  import Checkbox from '@smui/checkbox';
  import FormField from '@smui/form-field';
  import { useEdges, useNodes } from '@xyflow/svelte';
  import type { Dataset } from '$lib/dataset';
  import { _ as __ } from 'svelte-i18n';

  export let edge_id: string | undefined;
  export let node_id: string | undefined;
  export let top: number | undefined;
  export let left: number | undefined;
  export let right: number | undefined;
  export let bottom: number | undefined;
  export let dataset: Dataset;
  export let onClick: () => void;

  const nodes = useNodes();
  const edges = useEdges();

  const node = node_id ? $nodes.find((node) => node.id === node_id) : undefined;
  const edge = edge_id ? $edges.filter((edge) => edge.id === edge_id) : undefined;

  function deleteNode() {
    dataset.graph.deleteNode(node_id);
    onClick();
  }

  function deleteEdge() {
    if (!edge_id || !$edges || !Array.isArray($edges) || $edges.length === 0) {
      return;
    }

    $edges = $edges.filter((e) => e.id !== edge_id);

    if (edge && edge.length > 0) {
      const target_node = $nodes.find((n) => n.id === edge[0].target);
      if (target_node && target_node.data.input_ids) {
        const input_ids = target_node.data.input_ids;
        for (const key in input_ids) {
          if (Array.isArray(input_ids[key])) {
            input_ids[key] = input_ids[key].filter((val) => val.split('|')[0] !== edge[0].source);
          } else if (input_ids[key] === edge[0].source) {
            input_ids[key] = '';
          }
        }
      }
    }

    onClick();
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  style="top: {top}px; left: {left}px; right: {right}px; bottom: {bottom}px; position: fixed;"
  class="context-menu"
>
  <p style="margin: 0.5em;">
    <small
      >{#if node}
        {$__('node')}: {node_id}
      {/if}
      {#if edge}
        {$__('edge')}: {edge_id}
      {/if}
    </small>
  </p>
  {#if node}
    <div>
      <FormField align="end">
        <div>
          <Checkbox
            checked={node.data.show_in_ui}
            on:change={(x) => {
              // @ts-ignore
              node.data.show_in_ui = x.target.checked;
            }}
          />
        </div>
        <span slot="label">{$__('show_in_standard_view')}</span>
      </FormField>
    </div>
    {#if node.data.show_in_ui}
      <div>
        <FormField align="end">
          <div>
            <Checkbox
              checked={node.data.show_to_anon}
              on:change={(x) => {
                // @ts-ignore
                node.data.show_to_anon = x.target.checked;
              }}
            />
          </div>
          <span slot="label">{$__('show_to_anon')}</span>
        </FormField>
      </div>
    {/if}
    <hr />
    <button on:click={deleteNode}>{$__('delete_node')}</button>
  {/if}
  {#if edge}
    <hr />
    <button on:click={deleteEdge}>{$__('delete_edge')}</button>
  {/if}
</div>

<style>
  .context-menu {
    background: white;
    border-style: solid;
    box-shadow: 10px 19px 20px rgba(0, 0, 0, 10%);
    position: absolute;
    z-index: 10;
  }

  .context-menu button {
    border: none;
    display: block;
    padding: 0.5em;
    text-align: left;
    width: 100%;
  }

  .context-menu button:hover {
    background: #f8f8f8;
  }
</style>
