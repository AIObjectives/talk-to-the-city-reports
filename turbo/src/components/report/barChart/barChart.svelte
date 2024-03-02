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
  let lastWidth = 0;
  let innerWidth = 0;
  let resizeTimeout;

  $: {
    if (innerWidth !== lastWidth) {
      lastWidth = innerWidth;
      handleResize();
    }
  }

  async function handleResize() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(async () => {
      draw = [];
      await tick();
      draw = [0];
    }, 500);
  }

  onMount(async () => {
    await handleResize();
  });

  onDestroy(() => {
    clearTimeout(resizeTimeout);
  });
</script>

<svelte:window bind:innerWidth />

{#each draw as d}
  {#if complexHierarchy.children}
    {#each complexHierarchy.children as topic}
      <BarChartRow complexHierarchy={topic} {max} {color} {level} />
    {/each}
  {/if}
{/each}
