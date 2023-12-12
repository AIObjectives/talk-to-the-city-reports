<script lang="ts">
	import Cookies from 'js-cookie';
	export let dataset;
	import Close from '$lib/icons/Close.svelte';
	import ChevronRight from '$lib/icons/ChevronRight.svelte';
	import { viewMode } from '$lib/store';
	import { _ as __ } from 'svelte-i18n';
	import { onMount } from 'svelte';

	let isPaneVisible = true;
	let isCloseVisible = false;

	onMount(() => {
		isPaneVisible = Cookies.get('isPaneVisible') === 'true';
	});

	function togglePane() {
		isPaneVisible = !isPaneVisible;
		Cookies.set('isPaneVisible', isPaneVisible.toString());
	}
</script>

{#if $viewMode == 'standard'}
	<!-- svelte-ignore a11y-interactive-supports-focus -->
	<div
		class="left-pane"
		on:mouseover={() => (isCloseVisible = true)}
		on:mouseout={() => (isCloseVisible = false)}
		on:focus={() => (isCloseVisible = true)}
		on:blur={() => (isCloseVisible = false)}
		role="button"
		style="display: {isPaneVisible ? 'block' : 'none'}"
	>
		{#if dataset}
			<h2 class="text-2xl font-bold text-gray-600 py-3">{dataset.title}</h2>
			<h2 class="text-lg font-bold text-gray-600 py-3">{$__('description')}:</h2>
			<p class="text-gray-500 py-3">{dataset.description}</p>
			{#if dataset.projectParent}
				<p class="text-gray-500">Forked from:</p>
				<!-- svelte-ignore missing-declaration -->
				<a href="/report/{dataset.projectParent}"
					><p class="text-gray-500">{dataset.projectParent}</p></a
				>
			{/if}
		{/if}
	</div>

	{#if isPaneVisible}
		<button class="close" on:click={togglePane}>
			<Close color="#999" />
		</button>
	{:else}
		<button on:click={togglePane} class="chevron"
			><ChevronRight style="display: {isPaneVisible ? 'none' : 'block'}" /></button
		>
	{/if}
{/if}

<style>
	.left-pane {
		width: 20rem;
		min-width: 20rem;
		position: fixed;
		bottom: 20px;
		left: 20px;
		margin-top: 0;
		z-index: 0;
	}
	.close {
		position: fixed;
		bottom: 20px;
		left: 20px;
	}
	.chevron {
		position: fixed;
		bottom: 20px;
		left: 20px;
	}
</style>
