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
	// TODO(colleenm): support data sets that include both text and video claims
	let hasVideo = csv && 'video' in csv[0];

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
<small class="italic block">{$__('click_on_argument_to_see_original_claim')}</small>
{#if hasVideo}
	<small class="mb-5 italic block">
		<svg class="inline-block" xmlns="http://www.w3.org/2000/svg" height="22" 
				viewBox="0 -960 960 960" width="22" style="vertical-align: bottom;">
			<path d="m380-300 280-180-280-180v360ZM160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm0-80h640v-480H160v480Zm0 0v-480 480Z"/>
		</svg>
		{$__('these_claims_include_video_excerpts')}
	</small>
{/if}
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
