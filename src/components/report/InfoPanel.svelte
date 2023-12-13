<script lang="ts">
	import _ from 'lodash';
	import { _ as __ } from 'svelte-i18n';
	import InfoPanelClaim from './InfoPanelClaim.svelte';
	import { createEventDispatcher } from 'svelte';
	import type { Dataset } from '$lib/dataset';
	import IconButton from '@smui/icon-button';
	import Exclamation from '$lib/icons/Exclamation.svelte';
	import Paper from '@smui/paper';

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
		<Paper>
			{#if claims.length > 1}
				<h4 class="mb-3">{$__('claims')}: {_.map(claims.length.toString(), (c) => $__(c))}</h4>
				<h5 class="mb-3">{claims[0].claim}</h5>
			{/if}
			{#each claims as claim (claim.id)}
				<InfoPanelClaim {claim} {csv} {dataset} showClaims={claims.length == 1 && showClaims} />
			{/each}
		</Paper>

		{#if showFeedback}
			<IconButton
				class="material-icons"
				on:click={() => {
					dispatch('feedback', claims);
				}}><Exclamation size="15px" /></IconButton
			>
		{/if}
	</div>
{/if}

<style>
	.outer-div {
		max-height: 400px;
		overflow: auto;
	}
</style>
