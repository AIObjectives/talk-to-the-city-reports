<script lang="ts">
	import { page } from '$app/stores';
	import { query, where, getDocs } from 'firebase/firestore/lite';
	import { datasetCollection } from '$lib/firebase';
	import { onMount } from 'svelte';
	import Pipeline from '$components/Pipeline.svelte';
	import Report from '$components/Report.svelte';

	onMount(load_dataset);
	let loading = true;
	let dataset = null;

	async function load_dataset() {
		const q = query(datasetCollection, where('slug', '==', $page.params.project));
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
	<Pipeline bind:dataset />
	<Report bind:dataset />
{/if}
