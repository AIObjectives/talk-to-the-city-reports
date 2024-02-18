<script lang="ts">
  import { type NodeProps } from '@xyflow/svelte';
  import TextField from '@smui/textfield';
  import DGNode from './DGNode.svelte';
  import Checkbox from '@smui/checkbox';
  import FormField from '@smui/form-field';
  import HelperText from '@smui/textfield/helper-text';
  import { _ as __ } from 'svelte-i18n';

  type $$Props = NodeProps;

  export let data: $$Props['data'];
  export let id: $$Props['id'];
  export let isStandardView: boolean = false;

  export let showSystemPrompt = false;
  export let showPromptSuffix = false;
</script>

<DGNode
  {id}
  {data}
  {...$$restProps}
  {isStandardView}
  style={isStandardView ? '' : 'min-width: 500px; min-height: 400px;'}
  variant="outlined"
  color="aoi-green"
  _class="aoi-green"
>
  {#if !isStandardView}
    <FormField align="end">
      <span><Checkbox bind:checked={showSystemPrompt} /></span>
      <span slot="label">{$__('show_system_prompt')}</span>
    </FormField>
    {#if showSystemPrompt}
      <TextField
        style="width: 100%; overflow: auto"
        helperLine$style="width: 100% !important;"
        class="nowheel"
        textarea
        input$rows={5}
        value={data.system_prompt}
        on:keydown={(evt) => {
          if (evt.key === 'Backspace') {
            evt.stopPropagation();
          }
        }}
        on:input={(evt) => {
          data.system_prompt = evt.target?.value;
          data.dirty = true;
        }}
      >
        <HelperText slot="helper">{$__('system_extraction_prompt')}</HelperText>
      </TextField>
    {/if}
  {/if}
  {#if data.prompt !== undefined}
    <TextField
      style="width: 100%; overflow: auto"
      class="nowheel mt-2"
      helperLine$style="width: 100% !important;"
      textarea
      input$rows={12}
      value={data.prompt}
      on:input={(evt) => {
        data.prompt = evt.target?.value;
        data.dirty = true;
      }}
      on:keydown={(evt) => {
        if (evt.key === 'Backspace') {
          evt.stopPropagation();
        }
      }}
    >
      <HelperText slot="helper">{$__('primary_extraction_prompt')}</HelperText>
    </TextField>
  {/if}
  {#if !isStandardView && data.prompt_suffix}
    <FormField align="end">
      <span><Checkbox bind:checked={showPromptSuffix} /></span>
      <span slot="label">{$__('show_prompt_suffix')}</span>
    </FormField>
  {/if}
  {#if showPromptSuffix}
    <TextField
      style="width: 100%; overflow: auto"
      helperLine$style="width: 100% !important;"
      class="nowheel"
      textarea
      input$rows={5}
      value={data.prompt_suffix}
      on:keydown={(evt) => {
        if (evt.key === 'Backspace') {
          evt.stopPropagation();
        }
      }}
      on:input={(evt) => {
        data.prompt_suffix = evt.target?.value;
        data.dirty = true;
      }}
    >
      <HelperText slot="helper">{$__('extraction_prompt_suffix')}</HelperText>
    </TextField>
  {/if}
  <slot />
</DGNode>
