<script lang="ts">
	import { page } from '$app/stores';
	import { Dataset } from '$lib/dataset';
	import { onMount } from 'svelte';
	import { SvelteFlowProvider } from '@xyflow/svelte';
	import Pipeline from '$components/Pipeline.svelte';
	import Report from '$components/report/Report.svelte';
	import LeftPane from '$components/report/LeftPane.svelte';
	import { error } from '$components/toast/theme';

	let dataset: Dataset | null = null;

	onMount(async () => {
		const slug = $page.params.report;
		if (slug) {
			dataset = await Dataset.loadDataset(slug);
			if (!dataset) {
				console.log('Dataset not found');
				error('Dataset not found');
			}
		} else {
			console.log('No slug provided');
			error('No slug provided');
		}
	});
</script>

<LeftPane {dataset} />

<main>
	{#if !dataset}
		<p class="text-center text-lg text-gray-500">Loading...</p>
	{:else}
		<h1 class="text-3xl uppercase">{dataset.title}</h1>
		<SvelteFlowProvider>
			<Pipeline bind:dataset />
		</SvelteFlowProvider>
		<Report bind:dataset />
	{/if}
</main>

<style>
	main {
		flex-grow: 1;
		padding: 1rem;
	}

	@media (max-width: 768px) {
		main {
			order: 1;
			width: 100%;
		}
	}
</style>
