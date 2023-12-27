<script lang="ts">
	import { page } from '$app/stores';
	import { viewMode } from '$lib/store';
	import { Dataset } from '$lib/dataset';
	import { SvelteFlowProvider } from '@xyflow/svelte';
	import Pipeline from '$components/Pipeline.svelte';
	import Report from '$components/report/Report.svelte';
	import Description from '$components/report/Description.svelte';
	import { onMount } from 'svelte';
	import { _ as __ } from 'svelte-i18n';

	let dataset: Dataset | null = null;
	let dataset_refresh: number = 0;

	const loadDataset = async (slug: string) => {
		dataset = await Dataset.loadDataset(slug);
		dataset_refresh++;
	};

	onMount(() => {
		const slug = $page.params.report;
		if (slug) {
			loadDataset(slug);
		}
	});
</script>

<main>
	{#if !dataset}
		<p class="text-center text-lg text-gray-500">{$__('loading')}</p>
	{:else}
		{#if $viewMode == 'standard'}
			<Description bind:dataset />
		{/if}
		<SvelteFlowProvider>
			<Pipeline bind:dataset {dataset_refresh} />
		</SvelteFlowProvider>
		{#if $viewMode == 'graph'}
			<Description bind:dataset />
		{/if}
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
