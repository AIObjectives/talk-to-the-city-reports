<script lang="ts">
  /**
   * This component displays claims for the given subtopic.
   * It first performs a variety of operations on the claims:
   * - It groups claims by their text and counts the number of times each claim appears, and sorts them by count.
   * - It passes those claim groups to the Claim component.
   * - It only displays the first 5 claims by default, but allows the user to show more / less.
   *
   * Since reports can have a lot of claims, and the grouping, counting and sorting operations are slow and
   * expensive to run, it is important to use the `afterUpdate` lifecycle function to manually update
   * the claims data when the claims change, rather than $: which is too slow for large data sets.
   */
  import { afterUpdate } from 'svelte';
  import { _ as __ } from 'svelte-i18n';
  import _ from 'lodash';
  import Claim from './Claim.svelte';

  // Exported data:

  export let csv: any;
  export let claims: Claim[];
  export let showFeedback: boolean = false;

  // Computed data:

  let showMoreClaims = false;
  let sortedClaims = [];
  // ids tracks the ids of the claims to check if the claims have changed
  let ids = [];
  let hasVideo = false;

  const updateClaimsData = () => {
    if (claims) {
      hasVideo = _.some(csv, (o) => !_.isEmpty(_.get(o, 'video')));
      ids = _.map(claims, 'id');
      let duplicateClaims = _.countBy(claims, 'claim');
      sortedClaims = _.orderBy(
        _.uniqBy(claims, 'claim'),
        (claim) => duplicateClaims[claim.claim],
        'desc'
      );
    }
  };

  updateClaimsData();

  afterUpdate(() => {
    /*
     * Track claim IDs to determine if the claim IDs have changed, and update the
     * claims data only if the IDs have changed to be completely sure no unnecessary
     * computations take place.
     */
    if (claims && !_.isEqual(ids, _.map(claims, 'id'))) {
      updateClaimsData();
    }
  });
</script>

<div class="mt-4"><h4>{$__('representative_arguments')}</h4></div>
<small class="italic block">{$__('click_on_argument_to_see_original_claim')}</small>
{#if hasVideo}
  <small class="mb-5 italic block">
    <svg
      class="inline-block"
      xmlns="http://www.w3.org/2000/svg"
      height="22"
      viewBox="0 -960 960 960"
      width="22"
      style="vertical-align: bottom;"
    >
      <path
        d="m380-300 280-180-280-180v360ZM160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm0-80h640v-480H160v480Zm0 0v-480 480Z"
      />
    </svg>
    {$__('these_claims_include_video_excerpts')}
  </small>
{/if}
<div class="ml-4 mt-2">
  {#each sortedClaims.slice(0, showMoreClaims ? sortedClaims.length : 5) as claim (claim.claim)}
    <div class="flex items-center" style="color: black">
      <div class="text-sm">
        <Claim
          {hasVideo}
          {csv}
          claims={_.groupBy(claims, 'claim')[claim.claim]}
          on:feedback
          {showFeedback}
        />
      </div>
    </div>
  {/each}
  {#if sortedClaims.length > 5}
    <button class="text-sm font-bold" on:click={() => (showMoreClaims = !showMoreClaims)}>
      {showMoreClaims ? $__('show_less') : $__('show_more')}
    </button>
  {/if}
</div>

<style>
  button {
    color: var(--smui-primary);
  }
</style>
