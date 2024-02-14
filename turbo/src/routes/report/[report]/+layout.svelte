<script lang="ts">
	import { page } from '$app/stores';
	import { Dataset } from '$lib/dataset';
	import { globalViewMode, reportStore } from '$lib/store';
	import { onMount, setContext } from 'svelte';
	import { writable } from 'svelte/store';
	import Circle from '$lib/icons/Circle.svelte';
	import { hsl } from 'd3-color';
	import { ordinalColor, scrollToTopic } from '$lib/reportUtils';
	import { _ as __ } from 'svelte-i18n';
	import _ from 'lodash';

	let dataset: Dataset | null = null;
	let datasetSub = writable(null);

	setContext('dataset', datasetSub);

	onMount(async () => {
		const slug = $page.params.report;
		dataset = await Dataset.loadDataset(slug);
		datasetSub.set(dataset);
	});

	$: isStandard = $globalViewMode === 'standard';
	$: showDrawer = isStandard && $reportStore?.topics?.length > 0;
	$: appContentStyle = showDrawer ? 'margin-left: 256px;' : 'margin-left: 0;';

	let hoverColor = '#ffcc00';
</script>

<div class="drawer-container" class:standard-view={isStandard}>
	{#if showDrawer}
		<div id="drawerBackground">
			<div class="custom-drawer mt-4 hide-scrollbar">
				<button class="mt-2 block"
					on:click={() => {
						document.getElementById('graph-container').scrollIntoView({ behavior: 'smooth' });
					}}
					><h5>
						{$__('overview')}
					</h5></button
				>
				<button class="mt-2 nav-section"
					on:click={() => {
						document.getElementById('report-container').scrollIntoView({ behavior: 'smooth' });
					}}
				>
					<h5>{$__('clusters')}</h5>
				</button>
				{#each $reportStore?.topics as topic}
					<button
						class="topic-item mt-2 block"
						on:click={() => scrollToTopic(topic.topicName)}
						on:mouseover={() => {
							hoverColor = ('' + hsl(ordinalColor(topic.topicName)))
								.replace('rgb', 'rgba')
								.replace(')', ', 0.1)');
							document.documentElement.style.setProperty('--hover-color', hoverColor);
						}}
						on:focus={() => {
							hoverColor = ('' + hsl(ordinalColor(topic.topicName)))
								.replace('rgb', 'rgba')
								.replace(')', ', 0.1)');
							document.documentElement.style.setProperty('--hover-color', hoverColor);
						}}
						on:mouseout={() => {
							document.documentElement.style.removeProperty('--hover-color');
						}}
						on:blur={() => {
							document.documentElement.style.removeProperty('--hover-color');
						}}
						type="button"
					>
						<span><Circle color={'' + hsl(ordinalColor(topic.topicName))} /></span>
						&nbsp;
						<span>{_.truncate(topic.topicName, { length: 20 })}</span>
					</button>
					{#each topic.subtopics as subtopic}
						<button
							class="topic-item ml-6"
							on:click={() => scrollToTopic(subtopic.subtopicName)}
							on:mouseover={() => {
								hoverColor = ('' + hsl(ordinalColor(subtopic.topicName)))
									.replace('rgb', 'rgba')
									.replace(')', ', 0.1)');
								document.documentElement.style.setProperty('--hover-color', hoverColor);
							}}
							on:focus={() => {
								hoverColor = ('' + hsl(ordinalColor(subtopic.topicName)))
									.replace('rgb', 'rgba')
									.replace(')', ', 0.1)');
								document.documentElement.style.setProperty('--hover-color', hoverColor);
							}}
							on:mouseout={() => {
								document.documentElement.style.removeProperty('--hover-color');
							}}
							on:blur={() => {
								document.documentElement.style.removeProperty('--hover-color');
							}}
							type="button"
						>
							<small>{_.truncate(subtopic.subtopicName, { length: 30 })}</small>
						</button>
					{/each}
				{/each}
				<button class="mt-2 block"
					on:click={() => {
						document.getElementById('appendix').scrollIntoView({ behavior: 'smooth' });
					}}
				>
					<h5>
						{$__('appendix')}
					</h5>
				</button>
			</div>
		</div>
	{/if}

	<div class="app-content" style={appContentStyle}>
		<main class="main-content">
			<slot />
		</main>
	</div>
</div>

<style>
	#drawerBackground {
		background-color: #f2f2f2;
		width: 256px;
		height: 100%;
		position: fixed;
		z-index: 1;
		overflow-y: auto;
	}
	.drawer-container {
		display: flex;
		border: 1px solid rgba(0, 0, 0, 0.1);
	}

	.drawer-container.standard-view {
		height: auto;
	}

	.drawer-container:not(.standard-view) {
		height: auto;
	}

	.custom-drawer {
		width: inherit;
		height: calc(100% - 50px);
		padding: 0 1.5rem;
		box-sizing: border-box;
		overflow-y: auto;
		color: rgba(0,0,0,.75);
	}

	.app-content {
		flex-grow: 1;
		overflow-x: hidden;
		position: relative;
		transition: margin-left 0.3s;
	}

	.main-content {
		box-sizing: border-box;
		max-height: 100%;
		height: 100%;
	}

	.topic-item {
		display: flex;
		align-items: center;
		gap: 2px;
		padding-left: .5rem;
		cursor: pointer;
		width: 100%;
	}

	.topic-item:hover {
		background-color: var(--hover-color);
	}
	.hide-scrollbar {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}

	.hide-scrollbar::-webkit-scrollbar {
		display: none;
	}
</style>
