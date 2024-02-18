<script lang="ts">
  import { writable } from 'svelte/store';
  import { type NodeProps } from '@xyflow/svelte';
  import TextField from '@smui/textfield';
  import Button from '@smui/button';
  import { useUpdateNodeInternals } from '@xyflow/svelte';
  import DGNode from './DGNode.svelte';
  import { _ as __ } from 'svelte-i18n';

  type $$Props = NodeProps;

  export let data: $$Props['data'];
  export let id: $$Props['id'];

  const updateNodeInternals = useUpdateNodeInternals();

  // Create writable stores and initialize with data values
  const generateStore = writable(Object.entries(data.generate || {}));
  const deleteStore = writable(data.delete || []);
  const renameStore = writable(Object.entries(data.rename || {}));

  // Subscribe to store changes and update data object
  generateStore.subscribe((value) => {
    data.generate = Object.fromEntries(value);
    updateNodeInternals(id);
  });

  deleteStore.subscribe((value) => {
    data.delete = value;
    updateNodeInternals(id);
  });

  renameStore.subscribe((value) => {
    data.rename = Object.fromEntries(value);
    updateNodeInternals(id);
  });

  // Function to handle CSV action updates
  function updateCSVAction(store, action, index, value) {
    store.update((items) => {
      if (action === 'add') {
        const isObjectStore = store === generateStore || store === renameStore;
        data.dirty = true;
        return [...items, isObjectStore ? ['', ''] : ''];
      } else if (action === 'remove') {
        data.dirty = true;
        return items.filter((_, i) => i !== index);
      } else if (action === 'update') {
        items[index] = value;
        data.dirty = true;
        return items;
      }
    });
  }
</script>

<DGNode {id} {data} {...$$restProps}>
  <p>{$__('generate_columns')}</p>
  {#each $generateStore as item, index}
    <div class="csv-action-item">
      <TextField
        style="width: 35%;"
        helperLine$style="width: 35%;"
        class="nodrag"
        type="text"
        on:keydown={(evt) => {
          if (evt.key === 'Backspace') {
            evt.stopPropagation();
          }
        }}
        on:input={(evt) =>
          updateCSVAction(generateStore, 'update', index, [evt.target?.value, item[1]])}
        value={item[0]}
        placeholder="Column Name"
      />
      <TextField
        style="width: 35%;"
        helperLine$style="width: 35%;"
        class="nodrag"
        type="text"
        on:keydown={(evt) => {
          if (evt.key === 'Backspace') {
            evt.stopPropagation();
          }
        }}
        on:input={(evt) =>
          updateCSVAction(generateStore, 'update', index, [item[0], evt.target?.value])}
        value={item[1]}
        placeholder="Value"
      />
      <Button on:click={() => updateCSVAction(generateStore, 'remove', index)}
        >{$__('remove')}</Button
      >
    </div>
  {/each}
  <Button on:click={() => updateCSVAction(generateStore, 'add')}
    >{$__('add_generate_column')}</Button
  >

  <br /><br />
  <p>{$__('delete_columns')}</p>
  {#each $deleteStore as item, index}
    <div class="csv-action-item">
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
        on:input={(evt) => updateCSVAction(deleteStore, 'update', index, evt.target?.value)}
        value={item}
      />
      <Button on:click={() => updateCSVAction(deleteStore, 'remove', index)}>{$__('remove')}</Button
      >
    </div>
  {/each}
  <Button on:click={() => updateCSVAction(deleteStore, 'add')}>{$__('add_delete_column')}</Button>

  <br /><br />
  <p>{$__('rename_columns')}</p>
  {#each $renameStore as item, index}
    <div class="csv-action-item">
      <TextField
        style="width: 35%;"
        helperLine$style="width: 35%;"
        class="nodrag"
        type="text"
        on:keydown={(evt) => {
          if (evt.key === 'Backspace') {
            evt.stopPropagation();
          }
        }}
        on:input={(evt) =>
          updateCSVAction(renameStore, 'update', index, [evt.target?.value, item[1]])}
        value={item[0]}
        placeholder="Original Name"
      />
      <TextField
        style="width: 35%;"
        helperLine$style="width: 35%;"
        class="nodrag"
        type="text"
        on:keydown={(evt) => {
          if (evt.key === 'Backspace') {
            evt.stopPropagation();
          }
        }}
        on:input={(evt) =>
          updateCSVAction(renameStore, 'update', index, [item[0], evt.target?.value])}
        value={item[1]}
        placeholder="New Name"
      />
      <Button on:click={() => updateCSVAction(renameStore, 'remove', index)}>{$__('remove')}</Button
      >
    </div>
  {/each}
  <Button on:click={() => updateCSVAction(renameStore, 'add')}>{$__('add_rename_column')}</Button>
</DGNode>

<style>
  .csv-action-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
  }
</style>
