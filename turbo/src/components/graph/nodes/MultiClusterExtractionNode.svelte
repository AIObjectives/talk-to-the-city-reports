<script lang="ts">
  import Textfield from '@smui/textfield';
  import HelperText from '@smui/textfield/helper-text';
  import Cookies from 'js-cookie';

  import { type NodeProps } from '@xyflow/svelte';
  import PromptNode from '$components/graph/nodes/PromptNode.svelte';
  import { _ as __ } from 'svelte-i18n';
  import _ from 'lodash';
  type $$Props = NodeProps;
  export let data: $$Props['data'];
  $: defaultLocale = Cookies.get('locale') || 'en-US';
  $: formatter = new Intl.NumberFormat(defaultLocale, {
    style: 'decimal'
  });
</script>

<PromptNode {...$$restProps} {data}>
  {#if formatter}
    <br />
    <Textfield
      value={formatter.format(data.context_limit)}
      label={$__('context_limit')}
      on:input={(x) => {
        const inputValue = x.target.value;
        const numericValue = inputValue.replace(/[^0-9.-]+/g, '');
        data.context_limit = parseInt(numericValue);
        data.dirty = true;
      }}
    >
      <HelperText slot="helper">{$__('limit_context_to_number_of_tokens')}</HelperText>
    </Textfield>
    <p>{$__('num_tokens')}: {formatter.format(data.num_tokens)}</p>
    <p>{$__('num_chunks')}: {formatter.format(data.num_chunks)}</p>
  {/if}
</PromptNode>
