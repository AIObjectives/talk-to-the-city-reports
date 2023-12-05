<script lang="ts">
	import { Dataset } from '$lib/dataset';
	import Report from '$components/report/Report.svelte';
	import LeftPane from '$components/report/LeftPane.svelte';

	export let data;
	const dataset = Dataset.loadDatasetFromDoc(data.doc, data.id);
</script>

<LeftPane {dataset} />

<main>
	{#if !dataset}
		<p class="text-center text-lg text-gray-500">Loading...</p>
	{:else}
		<h1 class="text-3xl uppercase">{dataset.title}</h1>
		<Report {dataset} />
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
