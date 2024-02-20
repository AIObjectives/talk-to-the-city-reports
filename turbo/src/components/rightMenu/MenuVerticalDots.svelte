<script lang="ts">
  import DotsVertical from '$lib/icons/DotsVertical.svelte';
  import { globalViewMode } from '$lib/store';
  export let showDropdown: boolean;
  $: isStandard = $globalViewMode == 'standard';
</script>

<button
  on:click|stopPropagation={() => (showDropdown = !showDropdown)}
  class="focus:outline-none dots"
  style="padding-top: 4px"
>
  <DotsVertical size="1.4rem" color={isStandard ? '#dedede' : '#000000'} />
</button>

<svelte:window
  on:click={() => {
    showDropdown = false;
  }}
/>

<style>
  .dots {
    z-index: 100000;
  }
</style>
