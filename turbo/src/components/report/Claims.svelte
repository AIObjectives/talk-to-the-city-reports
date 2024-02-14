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

<div class="mt-4"><h4>{$__('representative_arguments')}</h4></div>
<small class="mb-5 italic">{$__('click_on_argument_to_see_original_claim')}</small>
<div class="ml-4 mt-2">
	{#each sortedClaims.slice(0, showMoreClaims ? sortedClaims.length : 5) as claim (claim.claim)}
		<div class="flex items-center" style="color: black">
			<div class="text-sm">
				<Claim {csv} claims={_.groupBy(claims, 'claim')[claim.claim]} on:feedback {showFeedback} />
			</div>
		</div>
	{/each}
	{#if sortedClaims.length > 5}
		<button class="text-sm font-bold"
		    on:click={() => (showMoreClaims = !showMoreClaims)}>
			{showMoreClaims ? $__('show_less') : $__('show_more')}
		</button>
	{/if}
</div>

<style>
	button {
		color: var(--smui-primary);
	}
</style>
