<script lang="ts">
  import InfoPanel from '$components/report/InfoPanel.svelte';
  import { Popover } from 'svelte-ux';

  import { _ as __ } from 'svelte-i18n';
  import _ from 'lodash';

  export let showFeedback: boolean = false;
  export let csv: any;
  export let claims: any;
  export let hasVideo = false;
  let popoverClass = hasVideo ? 'popover-video' : 'popover-no-video';

  let open = false;
</script>

{#if _.isArray(claims)}
  <span
    class="claim"
    role="button"
    tabindex="0"
    on:mousedown={() => {
      open = true;
    }}
  >
    • {claims[0]?.claim}
    {#if claims.length > 1}
      <small class="repeated">
        <i
          >({$__('repeated')}
          {_.map(claims.length.toString(), (c) => $__(c)).join('')}
          {$__('times')})</i
        ></small
      >
    {/if}
  </span>
  {#if open}
    <Popover bind:open padding={10} class="z-1 {popoverClass}">
      <InfoPanel {csv} {claims} showClaims={false} showVideo={true} on:feedback {showFeedback} />
    </Popover>
  {/if}
{/if}

<style>
  :global(.popover-video) {
    max-width: 400px;
    max-height: 500px;
    overflow-y: auto;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
  :global(.popover-no-video) {
    max-width: 320px;
    max-height: 400px;
    overflow-y: auto;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
  .claim {
    cursor: pointer;
  }
  .claim:hover {
    color: var(--smui-primary);
  }
  .repeated {
    color: #414141;
    font-size: 0.8em;
  }
</style>
