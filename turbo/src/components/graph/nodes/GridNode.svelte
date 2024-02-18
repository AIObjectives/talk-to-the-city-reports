<script lang="ts">
  import { type NodeProps } from '@xyflow/svelte';
  import DGNode from './DGNode.svelte';
  import GridNested from '$components/GridNested.svelte';

  type $$Props = NodeProps;

  export let data: $$Props['data'];
  export let id: $$Props['id'];
  export let isStandardView: boolean = false;
</script>

<DGNode {id} {data} {...$$restProps} style="">
  {#if data && data.output}
    <GridNested data={data.output} {id} {isStandardView} />
  {/if}
</DGNode>
