<script lang="ts">
  import Checkbox from '@smui/checkbox';
  import FormField from '@smui/form-field';
  import { writable } from 'svelte/store';
  import { useNodes, type NodeProps } from '@xyflow/svelte';
  import TextField from '@smui/textfield';
  import Button from '@smui/button';
  import DGNode from './DGNode.svelte';
  import { _ as __ } from 'svelte-i18n';

  type $$Props = NodeProps;

  export let data: $$Props['data'];
  export let id: $$Props['id'];

  const nodes = useNodes();

  const keysStore = writable(data.keys);
  const langStore = writable(data.target_languages);

  keysStore.subscribe((keys) => {
    data.keys = keys;
    $nodes = $nodes;
  });

  langStore.subscribe((target_languages) => {
    data.target_languages = target_languages;
    $nodes = $nodes;
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

  function addTargetLanguage() {
    data.dirty = true;
    langStore.update((langs) => [...langs, '']);
  }

  function removeTargetLanguage(index: number) {
    data.dirty = true;
    langStore.update((langs) => langs.filter((_, i) => i !== index));
  }

  function updateTargetLanguage(index: number, value: string) {
    data.dirty = true;
    langStore.update((langs) => {
      langs[index] = value;
      return langs;
    });
  }
</script>

<DGNode {id} {data} {...$$restProps}>
  <br />
  <p>{$__('input_language')}</p>
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
    bind:value={data.input_language}
  />
  <br />
  <br />
  <hr />
  <br />
  <p>{$__('target_languages')}</p>
  {#each $langStore as key, index}
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
        on:input={(evt) => updateTargetLanguage(index, evt.target?.value)}
        value={key}
      />
      <Button on:click={() => removeTargetLanguage(index)}>{$__('remove')}</Button>
    </div>
  {/each}
  <Button on:click={addTargetLanguage}>{$__('add_target_language')}</Button>
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
  <br />
  <FormField align="end">
    <Checkbox bind:checked={data.locale_is_selector} />
    <span slot="label">{$__('locale_is_selector')}</span>
  </FormField>
  <br />
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
