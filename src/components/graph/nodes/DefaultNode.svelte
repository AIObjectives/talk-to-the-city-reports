<script lang="ts">
	import DGNode from './DGNode.svelte';
	export let data;
</script>

<DGNode {...$$restProps} {data}>
	<div style="width: 150px; height: 50px;" />
	<div>{data.label}</div>
</DGNode>
