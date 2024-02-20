<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { tick } from 'svelte';
  import BarChartRow from '$components/report/barChart/barChartRow.svelte';

  export let complexHierarchy: Record<string, any>;
  export let color: string = '';
  export let level: 'top' | 'topic' = 'top';

  $: max = complexHierarchy?.children
    ? Math.max(...complexHierarchy.children.map((d: any) => d.value))
    : 0;
  let draw = [0];

  async function handleResize() {
    draw = [];
    await tick();
    setTimeout(() => {
      draw = [0];
    }, 500);
  }

  onMount(async () => {
    window.addEventListener('resize', handleResize);
    await handleResize();
  });

  onDestroy(() => {
    window.removeEventListener('resize', handleResize);
  });
</script>

{#each draw as d}
  {#if complexHierarchy.children}
    {#each complexHierarchy.children as topic}
      <BarChartRow complexHierarchy={topic} {max} {color} {level} />
    {/each}
  {/if}
{/each}
