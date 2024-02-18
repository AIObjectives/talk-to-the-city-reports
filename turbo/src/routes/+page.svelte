<script lang="ts">
  import { onMount } from 'svelte';
  import Button from '@smui/button';
  import { user } from '$lib/store';
  import Projects from '$components/Projects.svelte';
  import { _ as __ } from 'svelte-i18n';

  let mounted = false;

  onMount(() => (mounted = true));
</script>

<svelte:head>
  <title>tttc-turbo</title>
  <meta name="description" content="Talk to the City Turbo" />
</svelte:head>

<section>
  <h1 class="text-3xl pt-10 pb-10">Talk to the City Turbo</h1>

  {#if $user}
    <Projects />
    <Button href="/new-report" class="mt-10">{$__('new_report')}</Button>
  {:else if mounted}
    {$__('sign_in_to_continue')}
  {/if}
</section>

<style>
  section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 0px;
    padding-top: 0px;
  }

  h1 {
    width: 100%;
  }
</style>
