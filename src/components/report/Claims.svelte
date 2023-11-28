<script>
	let showMoreClaims = false;
	export let claims;
	import { _ } from 'svelte-i18n';
	// create a set of unique claims
	let uniqueClaims = new Set();
	claims.forEach((claim) => {
		uniqueClaims.add(claim.claim);
	});
	uniqueClaims = Array.from(uniqueClaims);
</script>

<div class="ml-5 mt-2 mb-2"><h5>{$_('representative_arguments')}:</h5></div>
<div class="ml-10">
	{#each uniqueClaims.slice(0, 5) as claim (claim)}
		<div class="flex items-center" style="color: black">
			<div class="text-sm"><i>• "{claim}"</i></div>
		</div>
	{/each}
	{#if uniqueClaims.length > 5}
		{#if !showMoreClaims}
			<button on:click={() => (showMoreClaims = !showMoreClaims)}>{$_('show_more')}</button>
		{/if}
		{#if showMoreClaims}
			{#each uniqueClaims.slice(5) as claim (claim)}
				<div class="flex items-center" style="color: black">
					<div class="text-sm"><i>• "{claim}"</i></div>
				</div>
			{/each}
		{/if}
	{/if}
</div>
