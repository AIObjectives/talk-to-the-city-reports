<script lang="ts">
	export let dataset;
	import { _ } from 'svelte-i18n';
</script>

<div class="left-pane">
	{#if dataset}
		<h2 class="text-2xl font-bold text-gray-600 py-3">{dataset.title}</h2>
		<h2 class="text-lg font-bold text-gray-600 py-3">{$_('description')}:</h2>
		<p class="text-gray-500 py-3">{dataset.description}</p>
	{/if}
</div>

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

	@media (max-width: 1400px) {
		.left-pane {
			display: none;
		}
	}

	@media (max-width: 768px) {
		.left-pane {
			width: 100%;
			order: 2;
			position: static;
		}
	}
</style>
