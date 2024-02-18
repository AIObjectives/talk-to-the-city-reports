<script lang="ts">
  import { type NodeProps } from '@xyflow/svelte';
  import UploadFileNode from '$components/graph/nodes/UploadFileNode.svelte';
  import Checkbox from '@smui/checkbox';
  import FormField from '@smui/form-field';
  import { _ as __ } from 'svelte-i18n';
  type $$Props = NodeProps;

  export let data: $$Props['data'];
</script>

<UploadFileNode {...$$restProps} {data} fileType="audio">
  <FormField>
    <Checkbox bind:checked={data.download} />
    <span slot="label">{$__('download')}</span>
  </FormField>
</UploadFileNode>
