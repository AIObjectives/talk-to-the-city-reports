<script lang="ts">
  import { _ as __ } from 'svelte-i18n';
  import _ from 'lodash';
  import { writable } from 'svelte/store';
  import { useUpdateNodeInternals } from '@xyflow/svelte';
  import { type NodeProps } from '@xyflow/svelte';

  import FormField from '@smui/form-field';
  import Checkbox from '@smui/checkbox';
  import TextField from '@smui/textfield';
  import Button from '@smui/button';

  import DGNode from './DGNode.svelte';

  type $$Props = NodeProps;

  export let data: $$Props['data'];
  export let id: $$Props['id'];

  const updateNodeInternals = useUpdateNodeInternals();

  const filterStore = writable(data.filters);

  filterStore.subscribe((value) => {
    data.filters = value;
    updateNodeInternals(id);
  });

  function updateCSVAction(store, action, index, value) {
    store.update((items) => {
      if (action === 'add') {
        const isObjectStore = store === filterStore;
        data.dirty = true;
        return [...items, isObjectStore ? {} : ''];
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
  <p>{$__('filter')}</p>
  <FormField align="end">
    <span><Checkbox bind:checked={data.exclusive} /></span>
    <span slot="label">{$__('exclusive')}</span>
  </FormField>
  {#each $filterStore as item, index}
    <div class="csv-action-item">
      <TextField
        style="width: 35%;"
        helperLine$style="width: 35%;"
        class="nodrag"
        type="text"
        label={$__('column_name')}
        on:keydown={(evt) => {
          // @ts-ignore
          if (evt.key === 'Backspace') {
            evt.stopPropagation();
          }
        }}
        on:input={(evt) => {
          updateCSVAction(filterStore, 'update', index, {
            // @ts-ignore
            column: evt.target?.value,
            value: item.value
          });
        }}
        value={item.column || ''}
        placeholder="Column Name"
      />
      <TextField
        style="width: 35%;"
        helperLine$style="width: 35%;"
        class="nodrag"
        type="text"
        label={$__('value')}
        on:keydown={(evt) => {
          // @ts-ignore
          if (evt.key === 'Backspace') {
            evt.stopPropagation();
          }
        }}
        on:input={(evt) =>
          updateCSVAction(filterStore, 'update', index, {
            column: item.column,
            // @ts-ignore
            value: evt.target?.value
          })}
        value={item.value || ''}
        placeholder="Value"
      />
      <Button on:click={() => updateCSVAction(filterStore, 'remove', index, null)}
        >{$__('remove')}</Button
      >
    </div>
  {/each}
  <Button on:click={() => updateCSVAction(filterStore, 'add', null, null)}
    >{$__('add_filter')}</Button
  >
</DGNode>

<style>
  .csv-action-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
  }
</style>
