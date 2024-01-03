<script lang="ts">
	import Close from '$lib/icons/Close.svelte';
	import { Dataset } from '$lib/dataset';
	import { _ as __ } from 'svelte-i18n';
	import { slide } from 'svelte/transition';

	export let showOwner: boolean = false;
	export let dataset: Dataset;
	export let loadDatasets: () => void;
	import Button from '@smui/button';
	import Card from '@smui/card';

	const deleteDataset = async () => {
		const assets: string[] = dataset.graph.listAssets();
		if (confirm($__('are_you_sure_delete_dataset') + '\n\n' + assets.join('\n'))) {
			await dataset.deleteDataset();
			loadDatasets();
		}
	};
</script>

<div in:slide={{ x: +100, duration: 300 }} out:slide={{ x: -100, duration: 300 }}>
	<Card class="w-72 relative rounded overflow-hidden m-4 p-4">
		<span class="absolute top-0 right-0 cursor-pointer mt-2 mr-2">
			<button on:click={deleteDataset}><Close /></button>
		</span>
		<p class="font-bold text-xl mb-2">{dataset.title}</p>
		<p class="text-gray-700 text-base">{dataset.description.slice(0, 100)}</p>
		<a href="/report/{dataset.slug}"> <Button>{$__('view_report')}</Button></a>
		<p class="text-gray-400 text-base"><small>/{dataset.slug}</small></p>
		{#if showOwner}
			<p class="text-gray-400 text-base"><small>Owner: {dataset.owner}</small></p>
		{/if}
	</Card>
</div>
