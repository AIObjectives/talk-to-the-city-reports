<script lang="ts">
  import { type NodeProps } from '@xyflow/svelte';
  import DGNode from './DGNode.svelte';
  import _ from 'lodash';
  import { _ as __ } from 'svelte-i18n';

  type $$Props = NodeProps;

  export let data: $$Props['data'];
  export let id: $$Props['id'];
</script>

<DGNode {data} {id} {...$$restProps}>
  <br />
</DGNode>
