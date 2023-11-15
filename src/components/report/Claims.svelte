<script>
	let showMoreClaims = false;
	export let report;
	export let topic;
	export let subtopic;
	export let getClaimsForTopic;
</script>

<div class="ml-5 mt-2 mb-2"><h5>Representative arguments:</h5></div>
<div class="ml-10">
	{#each getClaimsForTopic(report, topic.topicName, subtopic.subtopicName).slice(0, 5) as claim (claim.claim)}
		<div class="flex items-center" style="color: black">
			<div class="text-sm"><i>• "{claim.claim}"</i></div>
		</div>
	{/each}
	{#if getClaimsForTopic(report, topic.topicName, subtopic.subtopicName).length > 5}
		{#if !showMoreClaims}
			<button on:click={() => (showMoreClaims = !showMoreClaims)}>Show more</button>
		{/if}
		{#if showMoreClaims}
			{#each getClaimsForTopic(report, topic.topicName, subtopic.subtopicName).slice(5) as claim (claim.claim)}
				<div class="flex items-center" style="color: black">
					<div class="text-sm"><i>• "{claim.claim}"</i></div>
				</div>
			{/each}
		{/if}
	{/if}
</div>
