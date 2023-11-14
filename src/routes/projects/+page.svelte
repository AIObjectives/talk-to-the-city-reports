<script>
	import { getDocs, query } from 'firebase/firestore/lite';
	import { datasetCollection } from '$lib/firebase';
	import { onMount } from 'svelte';
	import ProjectCard from '$components/ProjectCard.svelte';

	let projects = [];
	let loading = true;

	async function load_projects() {
		const q = query(datasetCollection);
		const querySnapshot = await getDocs(q);
		projects = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
		projects = projects;
		loading = false;
	}

	onMount(load_projects);
</script>

<div class="flex flex-wrap justify-center">
	{#if loading}
		<p class="text-center text-lg text-gray-500">Loading...</p>
	{:else}
		{#each projects as project (project.timestamp)}
			<ProjectCard {project} {load_projects} />
		{/each}
	{/if}
</div>
