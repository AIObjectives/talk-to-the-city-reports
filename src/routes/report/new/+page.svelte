<script>
	import Button from '@smui/button';
	import HelperText from '@smui/textfield/helper-text';
	import TextField from '@smui/textfield';
	import Select, { Option } from '@smui/select';
	import { auth } from '$lib/firebase';
	import { Dataset } from '$lib/dataset';
	import { goto } from '$app/navigation';
	import { loadTemplates } from '$lib/templates';
	import { _ as __ } from 'svelte-i18n';
	import { onMount } from 'svelte';

	const defaultTemplate = 'heal_michigan_v0';
	let projectTitle = '';
	let projectSlug = '';
	let projectDescription = '';
	let projectTemplate = defaultTemplate;
	let templates;
	let showTemplate = true;

	function createProjectSlug(str) {
		return str
			.trim()
			.toLowerCase()
			.replace(/\s+/g, '-')
			.replace(/[^0-9a-z\-]/g, '');
	}

	onMount(async () => {
		templates = await loadTemplates();
	});

	async function createNewProject(event) {
		event.preventDefault();
		let graph = templates[projectTemplate];

		const newDataset = new Dataset(
			projectTitle,
			projectSlug,
			auth.currentUser.uid,
			projectTemplate,
			projectDescription,
			graph,
			null,
			null
		);

		const successFlag = await newDataset.addDatasetToFirebase();

		if (successFlag) {
			goto(`/report/${projectSlug}`);
		}
	}
</script>

<div class="flex flex-col items-center justify-center min-h-screen">
	<form on:submit={createNewProject} class="w-full max-w-sm mt-5">
		<div class="flex flex-wrap -mx-3 mb-6">
			<h2 class="px-3 w-full text-center text-xl font-bold mb-2">{$__('create_a_new_report')}</h2>
			<div class="w-full px-3">
				<TextField
					style="width: 100%;"
					label={$__('report_name')}
					bind:value={projectTitle}
					on:input={() => {
						projectSlug = createProjectSlug(projectTitle);
					}}
				/>
			</div>
			<div class="w-full px-3 py-5">
				<TextField style="width: 100%;" bind:value={projectSlug} label={$__('report_url_path')}>
					<HelperText persistent slot="helper"
						>https://tttc-turbo.web.app/report/{projectSlug}</HelperText
					>
				</TextField>
			</div>
			<div class="w-full px-3 py-5">
				<TextField style="width: 100%;" rows="5" textarea bind:value={projectDescription}>
					<HelperText persistent slot="helper">{$__('report_description')}</HelperText>
				</TextField>
			</div>
			{#if showTemplate}
				{#if templates}
					<div class="w-full px-3">
						<Select
							style="min-width: 400px;"
							label={$__('report_template')}
							bind:value={projectTemplate}
						>
							{#each Object.keys(templates) as templateKey}
								<Option value={templateKey}>{templateKey}</Option>
							{/each}
						</Select>
					</div>
				{:else}
					<p>{$__('loading_templates')}...</p>
				{/if}
			{/if}
			<div class="w-full px-3 pt-5">
				<Button raised type="submit">{$__('create')}</Button>
			</div>
		</div>
	</form>
</div>
