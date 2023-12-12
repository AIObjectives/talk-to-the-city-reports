<script lang="ts">
	import _ from 'lodash';
	import Paper from '@smui/paper';
	import { _ as __ } from 'svelte-i18n';
	import InfoPanelClaim from './InfoPanelClaim.svelte';
	import type { Dataset } from '$lib/dataset';

	export let clickEvent: any;
	export let csv: any;
	export let dataset: Dataset;

	$: claims = clickEvent?.node?.data?.claims;
</script>

{#if clickEvent && claims}
	<div class="outer-div">
		<Paper>
			{#if claims.length > 1}
				<h4 class="mb-3">{$__('claims')}: {_.map(claims.length.toString(), (c) => $__(c))}</h4>
				<h5 class="mb-3">{claims[0].claim}</h5>
			{/if}
			{#each clickEvent.node.data.claims as claim}
				<InfoPanelClaim {claim} {csv} {dataset} showClaims={claims.length == 1} />
			{/each}
		</Paper>
	</div>
{/if}

<style>
	.outer-div {
		height: 400px;
		overflow: auto;
	}
</style>
