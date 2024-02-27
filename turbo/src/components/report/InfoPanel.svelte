<script lang="ts">
  import _ from 'lodash';
  import { _ as __ } from 'svelte-i18n';
  import InfoPanelClaim from './InfoPanelClaim.svelte';
  import { createEventDispatcher } from 'svelte';
  import IconButton from '@smui/icon-button';
  import Exclamation from '$lib/icons/Exclamation.svelte';

  export let scrollHeight: string = '';
  export let showFeedback: boolean = false;
  export let showVideo: boolean = true;
  export let showClaims: boolean = true;
  export let clickEvent: any = undefined;
  export let csv: any;
  export let claims: any = undefined;
  export let useClass: string = '';
  const dispatch = createEventDispatcher();

  $: {
    if (clickEvent) {
      claims = clickEvent?.node?.data?.claims;
    }
  }
</script>

{#if claims}
  <div class="outer-div shadow-xl bg-white {useClass}">
    {#if showFeedback}
      <IconButton
        style="position: absolute; top: 0px; right: 0px; z-index: 1;"
        on:click={() => {
          dispatch('feedback', claims);
        }}><Exclamation size="12px" /></IconButton
      >
    {/if}
    <div class="scrollable-content" style={scrollHeight ? `height: ${scrollHeight};` : ''}>
      <h4 class="mb-3">
        {$__('claim')}
      </h4>
      <h5 class="mb-3">{claims[0].claim}</h5>
      <h5>
        {#if claims.length == 1}
          {$__('quote')}
        {:else}
          {$__('quotes')}: ({_.join(
            _.map(claims.length.toString(), (c) => $__(c)),
            ''
          )})
        {/if}
      </h5>
      {#each claims as claim, i (claim.id)}
        <InfoPanelClaim {showVideo} {claim} {csv} {showClaims} />
      {/each}
    </div>
  </div>
{/if}

<style>
  .outer-div {
    position: relative;
    padding: 10px;
    z-index: 10000;
  }

  .scrollable-content {
    overflow: auto;
  }
</style>
