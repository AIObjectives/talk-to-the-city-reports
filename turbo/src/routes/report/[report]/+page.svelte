<script lang="ts">
	import { Dataset } from '$lib/dataset';
	import Pipeline from '$components/Pipeline.svelte';
	import Report from '$components/report/Report.svelte';
	import Description from '$components/report/Description.svelte';
	import { getContext } from 'svelte';
	import { _ as __ } from 'svelte-i18n';
	import { globalViewMode } from '$lib/store';

	$: isStandard = $globalViewMode == 'standard';

	let dataset: Dataset | null = null;

	const datasetSub = getContext('dataset');
	datasetSub.subscribe((value) => {
		dataset = value;
	});
</script>

<main id="report-main" class:standard-view={isStandard}>
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
	main.standard-view {
		height: calc(100vh - 150px);
	}

	main:not(.standard-view) {
		height: auto;
	}

	main {
		overflow-y: auto;
		overflow-x: hidden;
	}

	@media (max-width: 768px) {
		main {
			order: 1;
			width: 100%;
		}
	}
</style>
