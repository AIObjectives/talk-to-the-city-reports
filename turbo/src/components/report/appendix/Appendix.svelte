<script lang="ts">
  import { _ as __ } from 'svelte-i18n';
  import { get } from 'svelte/store';

  import Card, { Content } from '@smui/card';

  import { Dataset } from '$lib/dataset';
  import { topologicalSort } from '$lib/utils';
  import AppendixLine from './AppendixLine.svelte';

  let openId: string = '';
  let openType: string = '';
  $: _class = 'w-full my-0 mx-auto ';
  export let dataset: Dataset;
  let exclude = ['open_ai_key'];
</script>

<div id="appendix" class="flex px-4">
  <Card class={_class}>
    <Content class="text-left">
      <h3>{$__('appendix_section')}</h3>
      <br />
      {#each topologicalSort(get(dataset.graph.nodes), get(dataset.graph.edges)) as node, index (node.id)}
        {#if !exclude.some((x) => node.data.compute_type.includes(x))}
          <AppendixLine {node} {index} bind:openId bind:openType />
        {/if}
      {/each}
    </Content>
  </Card>
</div>
