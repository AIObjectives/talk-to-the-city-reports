<script lang="ts">
	import BarChartRow from '$components/report/barChart/barChartRow.svelte';
	export let complexHierarchy: Record<string, any>;
	$: max = Math.max(...complexHierarchy.children.map((d: any) => d.value));
</script>

{#each complexHierarchy.children as topic}
	<BarChartRow complexHierarchy={topic} {max} />
{/each}
