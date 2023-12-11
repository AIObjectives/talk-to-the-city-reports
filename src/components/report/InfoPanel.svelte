<script lang="ts">
	import { _ } from 'svelte-i18n';
	import Paper from '@smui/paper';
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
				<h4 class="mb-3">Claims: {claims.length}</h4>
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
