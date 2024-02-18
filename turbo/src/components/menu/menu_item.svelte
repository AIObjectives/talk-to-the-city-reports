<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  export let showDropdown: boolean = false;
  export let path: string | null = null;
  export let label: string;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  on:click|stopPropagation={() => {
    dispatch('click');
    showDropdown = false;
  }}
>
  <a href={path} class="cursor-pointer block px-4 py-2 hover:bg-gray-300">{label}</a>
</div>

<style>
  .cursor-pointer {
    cursor: pointer;
  }
</style>
