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
				}}><Exclamation size="15px" /></IconButton
			>
		{/if}
		<div class="scrollable-content" style={scrollHeight ? `height: ${scrollHeight};` : ''}>
			{#if claims.length > 1}
				<h4 class="mb-3">
					{$__('claims')}: {_.join(
						_.map(claims.length.toString(), (c) => $__(c)),
						''
					)}
				</h4>
				<h5 class="mb-3">{claims[0].claim}</h5>
			{/if}
			{#each claims as claim, i (claim.id)}
				<InfoPanelClaim {showVideo} {claim} {csv} showClaims={claims.length == 1 && showClaims} />
				{#if i < claims.length - 1}
					<hr class="mt-5" />
				{/if}
			{/each}
		</div>
	</div>
{/if}

<style>
	.outer-div {
		position: relative;
		padding: 10px;
	}

	.scrollable-content {
		overflow: auto;
	}
</style>
