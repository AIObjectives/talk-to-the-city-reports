<script>
	import { deleteDoc, doc } from 'firebase/firestore/lite';
	import { datasetCollection } from '$lib/firebase';
	import Close from 'svelte-material-icons/Close.svelte';
	export let project;
	export let load_projects;

	const deleteProject = async () => {
		await deleteDoc(doc(datasetCollection, project.id));
		load_projects();
	};
</script>

<div class="w-72 relative rounded overflow-hidden shadow-lg m-4 p-4">
	<span class="absolute top-0 right-0 cursor-pointer mt-2 mr-2">
		<button on:click={deleteProject}><Close /></button>
	</span>

	<p class="font-bold text-xl mb-2">{project.title}</p>
	<p class="text-gray-700 text-base">{project.description}</p>
	<a
		href="/projects/{project.title}"
		class="block w-full bg-blue-300 hover:bg-blue-400 text-white font-bold py-2 px-4 mt-4 rounded text-center"
	>
		View project
	</a>
</div>
