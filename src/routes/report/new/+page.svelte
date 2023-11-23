<script>
	import Button from '@smui/button';
	import HelperText from '@smui/textfield/helper-text';
	import TextField from '@smui/textfield';
	import Select from '@smui/select';
	import MenuItem from '@smui/menu';
	import { query, where, getDocs } from 'firebase/firestore/lite';
	import { addDoc, serverTimestamp } from 'firebase/firestore/lite';
	import { auth, datasetCollection } from '$lib/firebase';
	import { success, error } from '$components/toast/theme';
	import { goto } from '$app/navigation';
	import { templates } from '$lib/templates';

	const defaultTemplate = 'heal_michigan';
	const showTemplate = false;
	let projectTitle = '';
	let projectSlug = '';
	let projectDescription = '';
	let projectTemplate = defaultTemplate;

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
		goto(`/report/${projectSlug}`);
	}
</script>

<div class="flex flex-col items-center justify-center min-h-screen">
	<form on:submit={createNewProject} class="w-full max-w-sm mt-5">
		<div class="flex flex-wrap -mx-3 mb-6">
			<h2 class="px-3 w-full text-center text-xl font-bold mb-2">Create a new project</h2>
			<div class="w-full px-3">
				<TextField style="width: 100%;" label="Report Name" bind:value={projectTitle} />
			</div>
			<div class="w-full px-3">
				<TextField style="width: 100%;" bind:value={projectSlug} label="Report slug" />
			</div>
			<div class="w-full px-3">
				<TextField style="width: 100%;" rows="5" textarea bind:value={projectDescription}>
					<HelperText persistent slot="helper">Report description</HelperText>
				</TextField>
			</div>
			{#if showTemplate}
				<div class="w-full px-3">
					<Select label="Project Template" bind:value={projectTemplate}>
						<MenuItem value="heal_michigan">Heal Michigan</MenuItem>
					</Select>
				</div>
			{/if}
			<div class="w-full px-3 pt-5">
				<Button raised type="submit">Create</Button>
			</div>
		</div>
	</form>
</div>
