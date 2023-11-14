<script>
	import { query, where, getDocs } from 'firebase/firestore/lite';
	import { addDoc, serverTimestamp } from 'firebase/firestore/lite';
	import { auth, datasetCollection } from '$lib/firebase';
	import { success, error } from '$components/toast/theme';
	import { goto } from '$app/navigation';
	import { templates } from '$lib/templates';

	let projectTitle = '';
	let projectSlug = '';
	let projectDescription = '';
	let projectTemplate = '';

	$: projectSlug = createProjectSlug(projectTitle);

	function createProjectSlug(str) {
		return str
			.trim()
			.toLowerCase()
			.replace(/\s+/g, '-')
			.replace(/[^0-9a-z\-]/g, '');
	}

	async function createNewProject(event) {
		event.preventDefault();
		let graph = templates[projectTemplate];

		if (!projectTitle || !projectSlug || !projectDescription || !projectTemplate) {
			error('Please fill all fields');
			return;
		}

		const q = query(datasetCollection, where('slug', '==', projectSlug));

		const querySnapshot = await getDocs(q);
		if (!querySnapshot.empty) {
			error('Project slug already exists');
			return;
		}

		await addDoc(datasetCollection, {
			title: projectTitle,
			slug: projectSlug,
			owner: auth.currentUser.uid,
			template: projectTemplate,
			timestamp: serverTimestamp(),
			description: projectDescription,
			graph: graph
		});

		success('Project added successfully');
		goto(`/projects/${projectSlug}`);
		projectTitle = '';
		projectSlug = '';
		projectDescription = '';
		projectTemplate = '';
	}
</script>

<div class="flex flex-col items-center justify-center min-h-screen">
	<form on:submit={createNewProject} class="w-full max-w-sm mt-5">
		<div class="flex flex-wrap -mx-3 mb-6">
			<h2 class="px-3 w-full text-center text-xl font-bold mb-2">Create a new project</h2>
			<div class="w-full px-3">
				<label
					class="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2"
					for="project-name"
				>
					Project Name
				</label>
				<input
					id="project-name"
					class="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
					type="text"
					placeholder="Enter project name"
					bind:value={projectTitle}
				/>
			</div>
			<div class="w-full px-3">
				<label
					class="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2"
					for="project-slug"
				>
					Project Slug
				</label>
				<input
					id="project-slug"
					class="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
					type="text"
					placeholder="Project slug"
					value={projectSlug}
					readonly
				/>
			</div>
			<div class="w-full px-3">
				<label
					class="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2"
					for="project-description"
				>
					Project Description
				</label>
				<textarea
					id="project-description"
					rows="5"
					class="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
					placeholder="Enter project description"
					bind:value={projectDescription}
				/>
			</div>
			<div class="w-full px-3">
				<label
					class="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2"
					for="project-template"
				>
					Project Template
				</label>
				<select
					id="project-template"
					class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
					bind:value={projectTemplate}
				>
					<option value="heal_michigan">Heal Michigan</option>
				</select>
			</div>
			<div class="w-full px-3 pt-5">
				<button
					class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
					type="submit"
				>
					Create
				</button>
			</div>
		</div>
	</form>
</div>
