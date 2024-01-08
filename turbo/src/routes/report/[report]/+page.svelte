<script lang="ts">
	import { page } from '$app/stores';
	import { Dataset } from '$lib/dataset';
	import Pipeline from '$components/Pipeline.svelte';
	import Report from '$components/report/Report.svelte';
	import Description from '$components/report/Description.svelte';
	import { onMount } from 'svelte';
	import { _ as __ } from 'svelte-i18n';
	import { globalViewMode } from '$lib/store';

	let dataset: Dataset | null = null;

	const loadDataset = async (slug: string) => {
		dataset = await Dataset.loadDataset(slug);
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
		{#if $globalViewMode == 'standard'}
			<Description bind:dataset />
		{/if}
		<Pipeline
			bind:dataset
			showSaveButton={true}
			showCopyButton={true}
			showScreenshotButton={true}
			enableGlobalViewMode={true}
			autoSave={true}
		/>
		{#if $globalViewMode == 'graph'}
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
