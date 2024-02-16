<script lang="ts">
	import { pipelineStepsRemaining } from '$lib/store';
	import { onDestroy } from 'svelte';

	import Snackbar, { Label } from '@smui/snackbar';

	let snackbar;
	let steps = 0;

	$: steps > 0 ? snackbar?.open() : snackbar?.close();

	const sub = pipelineStepsRemaining.subscribe((value) => {
		steps = value;
	});

	onDestroy(sub);
</script>

<Snackbar bind:this={snackbar} timeoutMs={steps > 0 ? -1 : 4000}>
	<Label>
		{#if steps > 0}
			Processing {steps} step{steps > 1 ? 's' : ''}
		{:else}
			Processing complete
		{/if}
	</Label>
</Snackbar>
