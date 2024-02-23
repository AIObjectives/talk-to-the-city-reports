<script lang="ts">
  import { type NodeProps } from '@xyflow/svelte';
  import TextField from '@smui/textfield';
  import DGNode from './DGNode.svelte';
  import _ from 'lodash';
  import { _ as __ } from 'svelte-i18n';

  type $$Props = NodeProps;

  export let data: $$Props['data'];
  export let id: $$Props['id'];

  const { text } = data;
</script>

<DGNode {data} {id} {...$$restProps}>
  {#if _.includes(['jq_v1', 'jsonata_v0', 'python_v0', 'pyodide_v0'], data.compute_type)}
    <TextField
      style="width: 100%; min-width: 400px;"
      helperLine$style="width: 100%;"
      class="nodrag"
      type="text"
      textarea
      input$rows={6}
      on:input={(evt) => {
        data.text = evt.target?.value;
        if (!data.prevent_dirty) data.dirty = true;
      }}
      value={text ? text : ''}
    />
  {:else}
    <TextField
      style="width: 100%;"
      helperLine$style="width: 100%;"
      class="nodrag"
      type="text"
      on:input={(evt) => {
        data.text = evt.target?.value;
        if (!data.prevent_dirty) data.dirty = true;
      }}
      value={text ? text : ''}
    />
  {/if}
</DGNode>
