<script lang="ts">
	import { page } from '$app/stores';
	import { query, where, getDocs } from 'firebase/firestore/lite';
	import { datasetCollection } from '$lib/firebase';
	import { onMount } from 'svelte';
	import Pipeline from '$components/Pipeline.svelte';
	import Report from '$components/report/Report.svelte';

	onMount(load_dataset);
	let loading = true;
	let dataset = null;

	async function load_dataset() {
		const q = query(datasetCollection, where('slug', '==', $page.params.report));
		const querySnapshot = await getDocs(q);
		let datasets = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
		loading = false;
		dataset = datasets[0];
		dataset = dataset;
	}
</script>

{#if loading && !dataset}
	<p class="text-center text-lg text-gray-500">Loading...</p>
{:else}
	<h1 class="text-3xl uppercase">{dataset.title}</h1>
	<Pipeline bind:dataset />
	<Report bind:dataset />
{/if}

<div class="left-pane p-5">
	{#if dataset}
		<h2 class="text-2xl font-bold">{dataset.title}</h2>
		<h2 class="text-lg font-bold mt-5 mb-2">Description:</h2>
		<p class="text-gray-500">{dataset.description}</p>
	{/if}
</div>

<style>
	.left-pane {
		width: 20rem;
		height: 100vh;
		position: fixed;
		left: 0;
		top: 0;
		background-color: #00000005;
	}
</style>
