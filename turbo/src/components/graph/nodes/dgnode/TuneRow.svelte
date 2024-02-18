<script lang="ts">
  import Checkbox from '@smui/checkbox';
  import FormField from '@smui/form-field';
  import TextField from '@smui/textfield';
  import _ from 'lodash';
  export let key: string;
  export let data: any;

  let hideKeys = ['icon', 'show_in_ui', 'label', 'compute_type', 'category', 'output'];
  let hide = _.includes(hideKeys, key);
</script>

{#if !hide}
  <div>
    {#if typeof data == 'boolean'}
      <FormField align="end">
        <Checkbox bind:checked={data} />
        <span slot="label">{key}</span>
      </FormField>
    {:else if typeof data == 'number'}
      <TextField
        helperLine$style="width: 100% !important;"
        value={data}
        label={key}
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
        label={key}
      />
    {:else if typeof data == 'object'}{:else}{/if}
  </div>
{/if}
