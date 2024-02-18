<script>
  import { fade } from 'svelte/transition';
  export let tooltipEvent;
</script>

{#if tooltipEvent}
  <div
    id="tooltip"
    transition:fade={{ duration: 300 }}
    style="top: {tooltipEvent.y + 50}px; left: {tooltipEvent.x + 50}px;"
  >
    {tooltipEvent.node.data.name}
  </div>
{/if}

<style>
  #tooltip {
    z-index: 10000;
    position: fixed;
    background-color: #222;
    max-width: 300px;
    color: #fff;
    padding: 10px;
    border-radius: 5px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.15);
  }
</style>
