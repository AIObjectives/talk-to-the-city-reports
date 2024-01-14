<script lang="ts">
	import { afterUpdate } from 'svelte';
	import { _ as __ } from 'svelte-i18n';
	import _ from 'lodash';
	import Claim from './Claim.svelte';

	export let csv: any;
	export let claims: Claim[];
	export let showFeedback: boolean = false;

	let showMoreClaims = false;
	let sortedClaims = [];
	let ids = [];

	const updateClaimsData = () => {
		if (claims) {
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
		if (claims && !_.isEqual(ids, _.map(claims, 'id'))) {
			updateClaimsData();
		}
	});
</script>

<div class="ml-5 mt-2 mb-2"><h5>{$__('representative_arguments')}:</h5></div>
<div class="ml-10">
	{#each sortedClaims.slice(0, showMoreClaims ? sortedClaims.length : 5) as claim (claim.claim)}
		<div class="flex items-center" style="color: black">
			<div class="text-sm">
				<Claim {csv} claims={_.groupBy(claims, 'claim')[claim.claim]} on:feedback {showFeedback} />
			</div>
		</div>
	{/each}
	{#if sortedClaims.length > 5}
		<button on:click={() => (showMoreClaims = !showMoreClaims)}>
			{showMoreClaims ? $__('show_less') : $__('show_more')}
		</button>
	{/if}
</div>
