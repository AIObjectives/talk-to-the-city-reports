<script>
	let showMoreClaims = false;
	export let claims;
	// create a set of unique claims
	let uniqueClaims = new Set();
	claims.forEach((claim) => {
		uniqueClaims.add(claim.claim);
	});
	uniqueClaims = Array.from(uniqueClaims);
</script>

<div class="ml-5 mt-2 mb-2"><h5>Representative arguments:</h5></div>
<div class="ml-10">
	{#each uniqueClaims.slice(0, 5) as claim (claim)}
		<div class="flex items-center" style="color: black">
			<div class="text-sm"><i>• "{claim}"</i></div>
		</div>
	{/each}
	{#if claims.length > 5}
		{#if !showMoreClaims}
			<button on:click={() => (showMoreClaims = !showMoreClaims)}>Show more</button>
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
