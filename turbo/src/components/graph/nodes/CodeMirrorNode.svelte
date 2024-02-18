<script lang="ts">
  import { type NodeProps } from '@xyflow/svelte';
  import CodeMirror from 'svelte-codemirror-editor';
  import { python } from '@codemirror/lang-python';
  import { javascript } from '@codemirror/lang-javascript';
  import { oneDark } from '@codemirror/theme-one-dark';
  import DGNode from './DGNode.svelte';
  import _ from 'lodash';
  import { _ as __ } from 'svelte-i18n';

  type $$Props = NodeProps;
  export let data: $$Props['data'];
</script>

<DGNode {data} {...$$restProps} style="overflow: auto;">
  <CodeMirror
    bind:value={data.text}
    theme={oneDark}
    lang={_.includes(data.compute_type, 'y') ? python() : javascript()}
  />
</DGNode>
