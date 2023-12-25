<script lang="ts">
	import Paper from '@smui/paper';
	import Button from '@smui/button';
	import Help from '$lib/icons/HelpCircle.svelte';
	import HelperText from '@smui/textfield/helper-text';
	import TextField from '@smui/textfield';
	import Select, { Option } from '@smui/select';
	import { auth } from '$lib/firebase';
	import { Dataset } from '$lib/dataset';
	import { goto } from '$app/navigation';
	import { loadTemplates } from '$lib/templates';
	import { _ as __ } from 'svelte-i18n';
	import _ from 'lodash'
	import { onMount } from 'svelte';

	function getRandomElement<T>(array: T[]): T {
		return array[Math.floor(Math.random() * array.length)];
	}

	function generateReportName(): string {
		const adjectives = [
			'eager',
			'funny',
			'eccentric',
			'interesting',
			'innovative',
			'dynamic',
			'persistent',
			'intelligent',
			'curious',
			'creative',
			'ambitious',
			'bold',
			'charming',
			'dazzling',
			'enthusiastic',
			'fearless',
			'gentle',
			'honest',
			'inventive',
			'joyful',
			'kindhearted',
			'lively',
			'meticulous',
			'nimble',
			'optimistic',
			'passionate',
			'quick',
			'rational',
			'sensible',
			'thoughtful',
			'upbeat',
			'vibrant',
			'warm',
			'xenodochial',
			'youthful',
			'zealous',
			'able',
			'breezy',
			'brilliant',
			'keen',
			'devoted',
			'earnest',
			'fierce',
			'glowing',
			'harmonious',
			'idealistic',
			'jolly',
			'luxurious',
			'magnificent',
			'noble'
		];

		const nouns = [
			'scientist',
			'scraper',
			'coder',
			'machine',
			'algorithm',
			'processor',
			'system',
			'engineer',
			'developer',
			'robot',
			'network',
			'interface',
			'database',
			'model',
			'designer',
			'administrator',
			'consultant',
			'analyst',
			'architect',
			'controller',
			'director',
			'educator',
			'facilitator',
			'guide',
			'helper',
			'innovator',
			'manager',
			'navigator',
			'observer',
			'planner',
			'researcher',
			'strategist',
			'teacher',
			'technician',
			'thinker',
			'utilizer',
			'validator',
			'visualizer',
			'writer',
			'explorer',
			'creator',
			'leader',
			'originator',
			'pioneer',
			'quizmaster',
			'reviewer',
			'specialist',
			'translator',
			'upholder',
			'virtuoso'
		];

		const adjective = getRandomElement(adjectives);
		const noun = getRandomElement(nouns);

		return `${adjective}-${noun}`;
	}

	const rand = generateReportName();
	let projectTitle = rand;
	let projectSlug = rand;
	let projectDescription = rand;
	let projectTemplate = 'default';
	let templates;
	let loadingTemplates = true;
	let show_help = false;

	function createProjectSlug(str) {
		return str
			.trim()
			.toLowerCase()
			.replace(/\s+/g, '-')
			.replace(/[^0-9a-z\-]/g, '');
	}

	onMount(async () => {
		templates = await loadTemplates();
		loadingTemplates = false;
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
	<div class="w-full max-w-sm mt-5">
		<div class="flex flex-wrap -mx-3 mb-6">
			<h2 class="px-3 w-full text-center text-xl font-bold mb-6">{$__('create_a_new_report')}</h2>
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
			{#if loadingTemplates}
				<p>{$__('loading_templates')}...</p>
			{:else}
				{#if ! _.isEmpty(templates)}
					<div class="w-full px-3" style="position: relative;">
						<button on:click={() => (show_help = !show_help)}><Help color="gray" /></button>
						{#if show_help}
							<Paper class="mb-5 w-full">
								<div class="docs">
									{$__('template_help')}
								</div>
							</Paper>
						{/if}
						{#if projectTemplate}
							<Select
								style="min-width: 400px;"
								label={$__('report_template')}
								bind:value={projectTemplate}
							>
								{#each Object.keys(templates) as templateKey}
									<Option value={templateKey}>{templateKey}</Option>
								{/each}
							</Select>
						{/if}
					</div>
				{:else}
					<p>{$__('no_templates_found')}</p>
				{/if}
			{/if}
			<button class="w-full px-3 pt-5" on:click={createNewProject}>
				<Button raised type="submit">{$__('create')}</Button>
			</button>
		</div>
	</div>
</div>
