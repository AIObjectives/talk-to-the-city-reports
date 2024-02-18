<script lang="ts">
  import { type NodeProps } from '@xyflow/svelte';
  import PromptNode from '$components/graph/nodes/PromptNode.svelte';
  import { _ as __ } from 'svelte-i18n';
  import _ from 'lodash';
  type $$Props = NodeProps;
  export let data: $$Props['data'];
</script>

<PromptNode {...$$restProps} {data}>
  <br />
</PromptNode>
