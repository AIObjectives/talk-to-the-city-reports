<script lang="ts">
	import { page } from '$app/stores';
	import { query, where, getDocs } from 'firebase/firestore/lite';
	import { datasetCollection } from '$lib/firebase';
	import { onMount } from 'svelte';
	import Pipeline from '$components/Pipeline.svelte';
	import Report from '$components/report/Report.svelte';
	import LeftPane from '$components/report/LeftPane.svelte';

	onMount(load_dataset);
	let loading = true;
	let dataset = null;

	async function load_dataset() {
		const q = query(datasetCollection, where('slug', '==', $page.params.report));
		const querySnapshot = await getDocs(q);
		let datasets = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
		loading = false;
		dataset = datasets[0];
	}
</script>

<LeftPane {dataset} />

<main>
	{#if loading && !dataset}
		<p class="text-center text-lg text-gray-500">Loading...</p>
	{:else}
		<h1 class="text-3xl uppercase">{dataset.title}</h1>
		<Pipeline bind:dataset />
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

	:root {
		--main-padding: 0.5rem;
		--main-max-width: 100%;
	}
</style>
