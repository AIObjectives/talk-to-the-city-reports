<script lang="ts">
  import { type NodeProps } from '@xyflow/svelte';

  import Checkbox from '@smui/checkbox';
  import FormField from '@smui/form-field';
  import PromptNode from '$components/graph/nodes/PromptNode.svelte';

  type $$Props = NodeProps;
  export let data: $$Props['data'];
  let json = data.response_format?.type === 'json_object';

  function onClick(x) {
    if (x.target?.checked) {
      data.response_format = { type: 'json_object' };
    } else {
      data.response_format = null;
    }
    data.dirty = true;
  }
</script>

<PromptNode {data} {...$$restProps}>
  <FormField align="end">
    <Checkbox checked={json} on:click={onClick} />
    <span slot="label">json</span>
  </FormField>
</PromptNode>
