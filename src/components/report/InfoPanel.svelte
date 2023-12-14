<script lang="ts">
	import _ from 'lodash';
	import { _ as __ } from 'svelte-i18n';
	import InfoPanelClaim from './InfoPanelClaim.svelte';
	import { createEventDispatcher } from 'svelte';
	import type { Dataset } from '$lib/dataset';
	import IconButton from '@smui/icon-button';
	import Exclamation from '$lib/icons/Exclamation.svelte';

	export let showFeedback: boolean = false;
	export let showVideo: boolean = true;
	export let showClaims: boolean = true;
	export let clickEvent: any = undefined;
	export let csv: any;
	export let dataset: Dataset;
	export let claims: any = undefined;
	const dispatch = createEventDispatcher();

	$: {
		if (clickEvent) {
			claims = clickEvent?.node?.data?.claims;
		}
	}
</script>

{#if claims}
	<div class="outer-div">
		{#if showFeedback}
			<IconButton
				style="position: absolute; top: 0px; right: 0px; z-index: 1;"
				on:click={() => {
					dispatch('feedback', claims);
				}}><Exclamation size="15px" /></IconButton
			>
		{/if}
		<div class="scrollable-content">
			{#if claims.length > 1}
				<h4 class="mb-3">{$__('claims')}: {_.map(claims.length.toString(), (c) => $__(c))}</h4>
				<h5 class="mb-3">{claims[0].claim}</h5>
			{/if}
			{#each claims as claim (claim.id)}
				<InfoPanelClaim
					{showVideo}
					{claim}
					{csv}
					{dataset}
					showClaims={claims.length == 1 && showClaims}
				/>
			{/each}
		</div>
	</div>
{/if}

<style>
	.outer-div {
		position: relative;
		padding-top: 20px;
	}

	.scrollable-content {
		height: 400px;
		overflow: auto;
	}
</style>
