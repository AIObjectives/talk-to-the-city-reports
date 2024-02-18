<script lang="ts">
  import Snackbar, { Actions, Label } from '@smui/snackbar';
  import Button from '@smui/button';
  import IconButton from '@smui/icon-button';
  import Close from '$lib/icons/Close.svelte';
  import { graphNotice } from '$lib/store';
  import { onMount, onDestroy } from 'svelte';
  import Cookies from 'js-cookie';
  import { _ as __ } from 'svelte-i18n';
  import { getContext } from 'svelte';

  let viewMode = getContext('viewMode');

  let snackbar: Snackbar;
  let sub = null;

  onMount(() => {
    sub = graphNotice.subscribe((x) => {
      if (x && snackbar) snackbar.open();
    });
  });

  onDestroy(() => {
    if (sub) sub();
  });
</script>

{#if !Cookies.get('hide_graph_notice_forever')}
  <Snackbar variant="stacked" bind:this={snackbar} timeoutMs={-1}>
    <Label>{$__('graph_view_notice_snackbar')}</Label>
    <Actions>
      <Button
        on:click={() => {
          snackbar.close();
          $viewMode = 'standard';
        }}>{$__('return_to_standard_view')}</Button
      >
      <Button
        on:click={() => {
          Cookies.set('hide_graph_notice_forever', true);
          snackbar.close();
        }}>{$__('dont_remind_me')}</Button
      >
      <IconButton
        on:click={() => {
          snackbar.close();
        }}
        class="material-icons"
        title="Dismiss"><Close /></IconButton
      >
    </Actions>
  </Snackbar>
{/if}
