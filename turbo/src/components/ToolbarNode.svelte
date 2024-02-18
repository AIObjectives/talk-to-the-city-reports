<script lang="ts">
  import { _ as __ } from 'svelte-i18n';
  import { slide } from 'svelte/transition';

  export let node;
  let x = 0;
  let y = 0;
  const onDragStart = (event: DragEvent, nodeType: string) => {
    if (!event.dataTransfer) return null;
    event.dataTransfer.setData('application/svelteflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };
  let showTooltip = false;
  export let resetTimeout;
</script>

<!-- svelte-ignore a11y-interactive-supports-focus -->
<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<div
  in:slide={{ x: +100, duration: 300 }}
  out:slide={{ x: -100, duration: 300 }}
  on:mouseover={() => {
    showTooltip = true;
    resetTimeout();
  }}
  on:mouseout={() => (showTooltip = false)}
  on:mousemove={(event) => {
    x = event.clientX;
    y = event.clientY;
  }}
  class="exec-buttons-bottom"
  style="height:42px;"
  draggable={true}
  role="button"
  on:dragstart={(event) => onDragStart(event, node.data.compute_type)}
>
  <!-- svelte-ignore a11y-missing-attribute -->
  <img src="/{node.data.icon}.png" style="width: 100%; height: 100%; object-fit: contain;" />
</div>

{#if showTooltip}
  <div
    style="position: fixed; top: {y + 30}px; left: {x +
      30}px; transform: translateX(-50%); background: #333; color: #fff; padding: 5px; border-radius: 5px;"
  >
    {$__(node.data.label)}<br />
    <small>({$__(node.data.compute_type)})</small>
  </div>
{/if}
