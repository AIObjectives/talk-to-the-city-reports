<script lang="ts">
  import { writable } from 'svelte/store';
  import { useUpdateNodeInternals, useNodes, type NodeProps } from '@xyflow/svelte';
  import TextField from '@smui/textfield';
  import Button from '@smui/button';
  import DGNode from './DGNode.svelte';
  import { _ as __ } from 'svelte-i18n';

  type $$Props = NodeProps;

  export let data: $$Props['data'];
  export let id: $$Props['id'];

  const updateNodeInternals = useUpdateNodeInternals();
  const nodes = useNodes();

  // Writable store for keys
  const keysStore = writable(data.keys);

  // Syncing store with data.keys
  keysStore.subscribe((keys) => {
    data.keys = keys;
    updateNodeInternals(id);
    $nodes = $nodes; // Trigger reactivity
  });

  function addKey() {
    data.dirty = true;
    keysStore.update((keys) => [...keys, '']);
  }

  function removeKey(index: number) {
    data.dirty = true;
    keysStore.update((keys) => keys.filter((_, i) => i !== index));
  }

  function updateKey(index: number, value: string) {
    data.dirty = true;
    keysStore.update((keys) => {
      keys[index] = value;
      return keys;
    });
  }
</script>

<DGNode {id} {data} {...$$restProps}>
  <TextField
    style="width: 100%;"
    label={$__('target_language')}
    helperLine$style="width: 100%;"
    class="nodrag"
    type="text"
    on:keydown={(evt) => {
      if (evt.key === 'Backspace') {
        evt.stopPropagation();
      }
    }}
    on:input={(evt) => {
      data.target_language = evt.target?.value;
      data.dirty = true;
      updateNodeInternals(id);
    }}
    value={data.target_language}
  />
  <br /><br /><br />
  <p>{$__('columns_to_translate')}</p>
  {#each $keysStore as key, index}
    <div class="key-item">
      <TextField
        style="width: 80%;"
        helperLine$style="width: 80%;"
        class="nodrag"
        type="text"
        on:keydown={(evt) => {
          if (evt.key === 'Backspace') {
            evt.stopPropagation();
          }
        }}
        on:input={(evt) => updateKey(index, evt.target?.value)}
        value={key}
      />
      <Button on:click={() => removeKey(index)}>{$__('remove')}</Button>
    </div>
  {/each}
  <Button on:click={addKey}>{$__('add_key')}</Button>
  <small style="color: gray">{data.gcs_path}</small>
</DGNode>

<style>
  .key-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
  }
</style>
