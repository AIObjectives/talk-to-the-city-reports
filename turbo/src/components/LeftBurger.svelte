<script lang="ts">
  import LeftMenu from '$lib/icons/Menu.svelte';
  import { isMobile, openLeftDrawer } from '$lib/store';
</script>

{#if $isMobile}
  <button
    on:click={() => {
      $openLeftDrawer = !$openLeftDrawer;
    }}
  >
    <LeftMenu color="white" size={'1.6rem'} />
  </button>
{/if}
