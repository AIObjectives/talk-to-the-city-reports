<script lang="ts">
	let showMoreClaims = false;
	export let claims;
	import { _ as __ } from 'svelte-i18n';
	import _ from 'lodash';

	let uniqueClaims = _.uniqBy(claims, 'claim');
	let duplicateClaims = _.countBy(claims, 'claim');
	let sortedClaims = _.orderBy(uniqueClaims, (claim) => duplicateClaims[claim.claim], 'desc');
</script>

<div class="ml-5 mt-2 mb-2"><h5>{$__('representative_arguments')}:</h5></div>
<div class="ml-10">
	{#each showMoreClaims ? sortedClaims : sortedClaims.slice(0, 5) as claim (claim.claim)}
		<div class="flex items-center" style="color: black">
			<div class="text-sm">
				<i>• {claim.claim}</i>
				{#if duplicateClaims[claim.claim] > 1}
					<small class="repeated">
						({$__('repeated')} {duplicateClaims[claim.claim]} {$__('times')})</small
					>
				{/if}
			</div>
		</div>
	{/each}
	{#if sortedClaims.length > 5}
		<button on:click={() => (showMoreClaims = !showMoreClaims)}>
			{showMoreClaims ? $__('show_less') : $__('show_more')}
		</button>
	{/if}
</div>

<style>
	.repeated {
		background-color: #eeeeff;
	}
</style>
