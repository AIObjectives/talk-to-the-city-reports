<script lang="ts">
  import { type NodeProps } from '@xyflow/svelte';
  import Button from '@smui/button';
  import DGNode from './DGNode.svelte';
  import _ from 'lodash';
  import { _ as __ } from 'svelte-i18n';
  import { getContext } from 'svelte';
  import { Dataset } from '$lib/dataset';

  const dataset: Dataset = getContext('dataset');

  type $$Props = NodeProps;

  export let data: $$Props['data'];
  export let id: $$Props['id'];

  $: node = dataset.graph.findImpl(id);
</script>

<DGNode {data} {id} {...$$restProps}>
  <br />
  <Button
    on:click={async () => {
      node.deleteIndex(dataset);
      dataset.graph.nodes.update((nodes) => {
        const nodeToUpdate = nodes.find((n) => n.id === id);
        return nodes;
      });
    }}>{$__('delete_index')}</Button
  >

  <br />
</DGNode>
