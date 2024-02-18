<script lang="ts">
  import { onDestroy } from 'svelte';
  import { _ as __ } from 'svelte-i18n';
  import { pipelineStepsRemaining } from '$lib/store';

  import Snackbar, { Label } from '@smui/snackbar';

  let snackbar;
  let steps = 0;

  $: steps > 0 ? snackbar?.open() : snackbar?.close();

  const sub = pipelineStepsRemaining.subscribe((value) => {
    steps = value;
  });

  onDestroy(sub);
</script>

<Snackbar bind:this={snackbar} timeoutMs={steps > 0 ? -1 : 4000}>
  <Label>
    {#if steps > 0}
      {steps > 1 ? $__('processing_steps') : $__('processing_step')}: {steps}
    {:else}
      {$__('processing_complete')}
    {/if}
  </Label>
</Snackbar>
