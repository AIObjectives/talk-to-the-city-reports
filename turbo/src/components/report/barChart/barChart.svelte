<script lang="ts">
	import BarChartRow from '$components/report/barChart/barChartRow.svelte';
	export let complexHierarchy: Record<string, any>;
	export let color: string = '';
	export let level: 'top' | 'topic' = 'top';
	$: max = complexHierarchy?.children
		? Math.max(...complexHierarchy.children.map((d: any) => d.value))
		: 0;
</script>

{#if complexHierarchy.children}
	{#each complexHierarchy.children as topic}
		<BarChartRow complexHierarchy={topic} {max} {color} {level} />
	{/each}
{/if}
