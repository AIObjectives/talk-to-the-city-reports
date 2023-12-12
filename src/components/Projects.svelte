<script lang="ts">
	import { query, where, getDocs } from 'firebase/firestore/lite';
	import { datasetCollection } from '$lib/firebase';
	import { onMount } from 'svelte';
	import ProjectCard from '$components/ProjectCard.svelte';
	import { user } from '$lib/store';
	import { Dataset } from '$lib/dataset';
	import { _ as __ } from 'svelte-i18n';

	let datasets: Dataset[] = [];
	let loading = true;

	async function loadDatasets() {
		const q = query(datasetCollection, where('owner', '==', $user.uid));
		const querySnapshot = await getDocs(q);
		datasets = querySnapshot.docs.map((doc) => {
			const data = doc.data();
			return new Dataset(
				data.title,
				data.slug,
				data.owner,
				data.template,
				data.description,
				data.graph,
				doc.id
			);
		});
		datasets = datasets;
		loading = false;
	}

	onMount(loadDatasets);
</script>

<div class="flex flex-wrap justify-center">
	{#if loading}
		<p class="text-center text-lg text-gray-500">{$__('loading')}</p>
	{/if}
	{#each datasets as dataset}
		<ProjectCard {dataset} {loadDatasets} />
	{/each}
</div>
