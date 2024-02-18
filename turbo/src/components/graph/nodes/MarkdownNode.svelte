<script lang="ts">
  import { type NodeProps } from '@xyflow/svelte';
  import TextField from '@smui/textfield';
  import DGNode from './DGNode.svelte';
  import { marked } from 'marked';
  import Pencil from '$lib/icons/PencilOutline.svelte';

  type $$Props = NodeProps;

  export let data: $$Props['data'];
  export let id: $$Props['id'];
  let rendered = '';
  let editing = false;
  $: {
    try {
      rendered = marked.parse(data.markdown);
    } catch (e) {
      rendered = `<pre>${e}</pre>`;
    }
  }
</script>

<DGNode {data} {id} color={'primary'} variant={'outlined'} {...$$restProps}>
  <button
    on:click={() => {
      editing = !editing;
    }}><Pencil /></button
  >
  {#if editing}
    <TextField
      style="width: 100%; overflow: auto; min-width: 500px; min-height: 600px;"
      class="nowheel nodrag"
      helperLine$style="width: 100% !important;"
      textarea
      input$rows={12}
      on:keydown={(evt) => {
        if (evt.key === 'Backspace') {
          evt.stopPropagation();
        }
      }}
      on:input={(evt) => {
        data.markdown = evt.target?.value;
        data.dirty = true;
      }}
      value={data.markdown}
    />
  {:else}
    <div class="nowheel docs">{@html rendered}</div>
  {/if}
</DGNode>
