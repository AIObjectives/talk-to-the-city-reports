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
	let dataset_refresh: number = 0;

	const loadDataset = async (slug: string) => {
		console.log('Loading dataset: ', slug);
		dataset = await Dataset.loadDataset(slug);
		dataset_refresh++;
		if (!dataset) {
			console.log('Dataset not found');
			error('Dataset not found');
		}
	};

	$: {
		const slug = $page.params.report;
		if (slug) {
			loadDataset(slug);
		} else {
			console.log('No slug provided');
			error('No slug provided');
		}
	}
</script>

<LeftPane {dataset} />

<main>
	{#if !dataset}
		<p class="text-center text-lg text-gray-500">Loading...</p>
	{:else}
		<SvelteFlowProvider>
			<Pipeline bind:dataset {dataset_refresh} />
		</SvelteFlowProvider>
		<Report bind:dataset />
	{/if}
</main>

<style>
	main {
		flex-grow: 1;
	}

	@media (max-width: 768px) {
		main {
			order: 1;
			width: 100%;
		}
	}
</style>
