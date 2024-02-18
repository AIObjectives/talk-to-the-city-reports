<script lang="ts">
  import PromptNode from '$components/graph/nodes/PromptNode.svelte';
  import Checkbox from '@smui/checkbox';
  import FormField from '@smui/form-field';
  import { _ as __ } from 'svelte-i18n';

  export let data: $$Props['data'];
</script>

<PromptNode {...$$restProps} {data}>
  <br />
  <FormField align="end">
    <span><Checkbox bind:checked={data.ignore_description} /></span>
    <span slot="label">{$__('ignore_description')}</span>
  </FormField>
</PromptNode>
