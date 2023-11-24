<script>
	import Button from '@smui/button';
	import HelperText from '@smui/textfield/helper-text';
	import TextField from '@smui/textfield';
	import Select, { Option } from '@smui/select';
	import { query, where, getDocs } from 'firebase/firestore/lite';
	import { addDoc, serverTimestamp } from 'firebase/firestore/lite';
	import { auth, datasetCollection } from '$lib/firebase';
	import { success, error } from '$components/toast/theme';
	import { goto } from '$app/navigation';
	import { loadTemplates } from '$lib/templates';
	import { onMount } from 'svelte';

	const defaultTemplate = 'heal_michigan_v0';
	const showTemplate = true;
	let projectTitle = '';
	let projectSlug = '';
	let projectDescription = '';
	let projectTemplate = defaultTemplate;
	let templates;

	function createProjectSlug(str) {
		return str
			.trim()
			.toLowerCase()
			.replace(/\s+/g, '-')
			.replace(/[^0-9a-z\-]/g, '');
	}

	onMount(async () => {
		templates = await loadTemplates();
		console.log(templates);
	});

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
		goto(`/report/${projectSlug}`);
	}
</script>

<div class="flex flex-col items-center justify-center min-h-screen">
	<form on:submit={createNewProject} class="w-full max-w-sm mt-5">
		<div class="flex flex-wrap -mx-3 mb-6">
			<h2 class="px-3 w-full text-center text-xl font-bold mb-2">Create a new project</h2>
			<div class="w-full px-3">
				<TextField
					style="width: 100%;"
					label="Report Name"
					bind:value={projectTitle}
					on:input={() => {
						projectSlug = createProjectSlug(projectTitle);
					}}
				/>
			</div>
			<div class="w-full px-3 py-5">
				<TextField style="width: 100%;" bind:value={projectSlug} label="Report url path">
					<HelperText persistent slot="helper"
						>https://tttc-turbo.web.app/report/{projectSlug}</HelperText
					>
				</TextField>
			</div>
			<div class="w-full px-3 py-5">
				<TextField style="width: 100%;" rows="5" textarea bind:value={projectDescription}>
					<HelperText persistent slot="helper">Report description</HelperText>
				</TextField>
			</div>
			{#if showTemplate}
				{#if templates}
					<div class="w-full px-3">
						<Select label="Project Template" bind:value={projectTemplate}>
							{#each Object.keys(templates) as templateKey}
								<Option value={templateKey}>{templateKey}</Option>
							{/each}
						</Select>
					</div>
				{:else}
					<p>Loading templates...</p>
				{/if}
			{/if}
			<div class="w-full px-3 pt-5">
				<Button raised type="submit">Create</Button>
			</div>
		</div>
	</form>
</div>
