<script lang="ts">
	import { _ as __ } from 'svelte-i18n';
	import _ from 'lodash';
	import Claim from './Claim.svelte';

	export let dataset: any;
	export let csv: any;
	export let claims;
	export let showFeedback: boolean = false;

	let showMoreClaims = false;
	let uniqueClaims = _.uniqBy(claims, 'claim');
	let grouped = _.groupBy(claims, 'claim');
	let duplicateClaims = _.countBy(claims, 'claim');
	let sortedClaims = _.orderBy(uniqueClaims, (claim) => duplicateClaims[claim.claim], 'desc');
</script>

<div class="ml-5 mt-2 mb-2"><h5>{$__('representative_arguments')}:</h5></div>
<div class="ml-10">
	{#each showMoreClaims ? sortedClaims : sortedClaims.slice(0, 5) as claim (claim.claim)}
		<div class="flex items-center" style="color: black">
			<div class="text-sm">
				<Claim {dataset} {csv} claims={grouped[claim.claim]} on:feedback {showFeedback} />
			</div>
		</div>
	{/each}
	{#if sortedClaims.length > 5}
		<button on:click={() => (showMoreClaims = !showMoreClaims)}>
			{showMoreClaims ? $__('show_less') : $__('show_more')}
		</button>
	{/if}
</div>
