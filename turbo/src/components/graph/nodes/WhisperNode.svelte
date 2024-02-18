<script lang="ts">
  import { type NodeProps } from '@xyflow/svelte';
  import TextField from '@smui/textfield';
  import DGNode from './DGNode.svelte';
  import _ from 'lodash';
  import { _ as __ } from 'svelte-i18n';
  import Select, { Option } from '@smui/select';

  type $$Props = NodeProps;

  function handleLanguageInput(evt: Event) {
    const target = evt.target as HTMLInputElement;
    data.language = target.value;
    data.dirty = true;
  }

  function handleTemperatureInput(evt: Event) {
    const target = evt.target as HTMLInputElement;
    data.temperature = parseInt(target.value);
    data.dirty = true;
  }

  function handlePromptInput(evt: Event) {
    const target = evt.target as HTMLInputElement;
    data.prompt = target.value;
    data.dirty = true;
  }

  function handleInterviewInput(evt: Event) {
    const target = evt.target as HTMLInputElement;
    data.interview = target.value;
  }

  function handleVideoInput(evt: Event) {
    const target = evt.target as HTMLInputElement;
    data.video = target.value;
  }

  export let data: $$Props['data'];
  export let id: $$Props['id'];
</script>

<DGNode {data} {id} {...$$restProps}>
  <TextField
    class="nodrag"
    type="text"
    label={$__('language')}
    on:input={handleLanguageInput}
    value={data.language ? data.language : ''}
  />
  <br />
  <Select bind:value={data.response_format} label={$__('response_format')}>
    {#each ['json', 'text', 'srt', 'verbose_json', 'vtt', 'custom'] as format}
      <Option
        value={format}
        on:click={() => {
          data.response_format = format;
          data.dirty = true;
        }}>{$__(format)}</Option
      >
    {/each}
  </Select>
  {#if data.response_format === 'custom'}
    <br />
    <TextField
      class="nodrag"
      type="text"
      label={$__('interview')}
      on:input={handleInterviewInput}
      value={data.interview ? data.interview : ''}
    />
    <br />
    <TextField
      class="nodrag"
      type="text"
      label={$__('video')}
      on:input={handleVideoInput}
      value={data.video ? data.video : ''}
    />
  {/if}
  <br />
  <TextField
    class="nodrag"
    type="number"
    label={$__('temperature')}
    on:input={handleTemperatureInput}
    value={data.temperature !== undefined ? data.temperature : 0}
  />
  <br />
  <TextField
    class="nodrag"
    type="text"
    label={$__('prompt')}
    on:input={handlePromptInput}
    value={data.prompt ? data.prompt : ''}
  />
  <br />
  {#if data.gcs_path}
    <small class="text-gray-500">{data.gcs_path}</small>
  {/if}
</DGNode>
