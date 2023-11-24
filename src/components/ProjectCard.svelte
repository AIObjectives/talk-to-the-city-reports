<script>
	import { deleteDoc, doc } from 'firebase/firestore/lite';
	import { datasetCollection } from '$lib/firebase';
	import Close from 'svelte-material-icons/Close.svelte';
	export let project;
	export let load_projects;
	import Button from '@smui/button';
	import Card from '@smui/card';

	const deleteProject = async () => {
		await deleteDoc(doc(datasetCollection, project.id));
		load_projects();
	};
</script>

<Card class="w-72 relative rounded overflow-hidden m-4 p-4">
	<span class="absolute top-0 right-0 cursor-pointer mt-2 mr-2">
		<button on:click={deleteProject}><Close /></button>
	</span>

	<p class="font-bold text-xl mb-2">{project.title}</p>
	<p class="text-gray-700 text-base">{project.description.slice(0, 100)}</p>
	<a href="/report/{project.slug}"> <Button>View report</Button></a>
</Card>
