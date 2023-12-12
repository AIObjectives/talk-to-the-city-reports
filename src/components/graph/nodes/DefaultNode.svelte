<script lang="ts">
	import DGNode from './DGNode.svelte';
	export let data;
	import { _ as __ } from 'svelte-i18n';
</script>

<DGNode {...$$restProps} {data}>
	<div style="width: 150px; height: 50px;" />
</DGNode>
