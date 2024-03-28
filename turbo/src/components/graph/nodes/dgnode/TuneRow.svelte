<script lang="ts">
  import Checkbox from '@smui/checkbox';
  import FormField from '@smui/form-field';
  import TextField from '@smui/textfield';
  import _ from 'lodash';
  import { _ as __ } from 'svelte-i18n';
  import { get } from 'svelte/store';
  import { user } from '$lib/store';
  import type { Dataset } from '$lib/dataset';

  export let key: string;
  export let data: any;
  export let dataset: Dataset;

  let hideKeys = [
    'icon',
    'show_in_ui',
    'label',
    'compute_type',
    'category',
    'output',
    'processing',
    'show_to_anon',
    'message',
    'show_settings_in_standard_view'
  ];
  $: restricted = key === 'restrict_to_owner' && get(user)?.uid !== dataset.owner;
  $: hide = _.includes(hideKeys, key) || restricted;
</script>

{#if !hide}
  <div>
    {#if typeof data == 'boolean'}
      <FormField align="end">
        <Checkbox bind:checked={data} />
        <span slot="label">{$__(key)}</span>
      </FormField>
    {:else if typeof data == 'number'}
      <TextField
        helperLine$style="width: 100% !important;"
        value={data}
        label={$__(key)}
        on:change={(x) => {
          data = parseFloat(x.target.value);
        }}
      />
    {:else if typeof data == 'string'}
      <TextField
        style="width: 100%;"
        textarea={true}
        helperLine$style="width: 100% !important;"
        bind:value={data}
        label={$__(key)}
      />
    {:else if typeof data == 'object'}{:else}{/if}
  </div>
{/if}
