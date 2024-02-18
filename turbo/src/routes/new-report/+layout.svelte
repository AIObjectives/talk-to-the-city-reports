<script lang="ts">
  import { user } from '$lib/store';
</script>

{#if $user}
  <slot />
{:else}
  You need to be signed in.
{/if}
