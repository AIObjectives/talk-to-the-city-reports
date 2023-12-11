<script lang="ts">
	import { Dataset } from '$lib/dataset';
	import { get } from 'svelte/store';
	import { _ as __ } from 'svelte-i18n';

	export let dataset: Dataset;
	export let claimId: string;

	let openQuestions: any = [];

	$: {
		if (dataset)
			openQuestions = get(dataset.graph.nodes).find(
				(n) => n.data?.compute_type === 'open_questions_v0'
			)?.data.output[claimId];
	}
</script>

{#if openQuestions.length}
	<p class="mt-5">{$__('open_questions')}:</p>
	{#each openQuestions as openQuestion}
		<p><i>- "{openQuestion.comment}"</i></p>
		<p>&nbsp;&nbsp; {openQuestion.user}</p>
	{/each}
{/if}
