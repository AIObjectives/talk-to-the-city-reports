<script lang="ts">
  import { type NodeProps } from '@xyflow/svelte';
  import Button from '@smui/button';
  import Checkbox from '@smui/checkbox';
  import FormField from '@smui/form-field';
  import PromptNode from '$components/graph/nodes/PromptNode.svelte';
  import TextField from '@smui/textfield';
  import HelperText from '@smui/textfield/helper-text';
  import { _ as __ } from 'svelte-i18n';
  type $$Props = NodeProps;
  export let data: $$Props['data'];
</script>

<PromptNode {...$$restProps} {data}>
  <br />
  <Button
    on:click={() => {
      data.prompts.push({ prompt: data.prompts[0]?.prompt || '', dirty: true });
      data.dirty = true;
    }}>{$__('add_prompt')}</Button
  >
  <br />
  {#each data.prompts as prompt, i}
    {#if prompt.prompt}
      <TextField
        style="width: 100%; overflow: auto"
        class="nowheel mt-2"
        helperLine$style="width: 100% !important;"
        value={prompt.prompt}
        on:input={(evt) => {
          data.prompts[i].prompt = evt.target?.value;
          data.prompts[i].dirty = true;
          data.dirty = true;
        }}
        on:keydown={(evt) => {
          if (evt.key === 'Backspace') {
            evt.stopPropagation();
          }
        }}
      >
        <HelperText slot="helper">{$__('primary_extraction_prompt')}</HelperText>
        {#if prompt.dirty}
          <div class="text-sm text-gray-500">{$__('unsaved_changes')}</div>
        {/if}
      </TextField>
    {/if}
  {/each}
  <br />
  <FormField align="end">
    <Checkbox
      on:click={(x) => {
        if (x.target?.checked) {
          data.response_format = { type: 'json_object' };
        } else {
          data.response_format = null;
        }
      }}
    />
    <span slot="label">json</span>
  </FormField>
  <br />
  <FormField align="end">
    <Checkbox bind:checked={data.join_output} />
    <span slot="label">{$__('join_output')}</span>
  </FormField>
</PromptNode>
