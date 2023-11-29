<script lang="ts">
	import Close from '$lib/icons/Close.svelte';
	import { Dataset } from '$lib/dataset';

	export let dataset: Dataset;
	export let loadDatasets: () => void;
	import Button from '@smui/button';
	import Card from '@smui/card';

	const deleteDataset = async () => {
		await dataset.deleteDataset();
		loadDatasets();
	};
</script>

<Card class="w-72 relative rounded overflow-hidden m-4 p-4">
	<span class="absolute top-0 right-0 cursor-pointer mt-2 mr-2">
		<button on:click={deleteDataset}><Close /></button>
	</span>

	<p class="font-bold text-xl mb-2">{dataset.title}</p>
	<p class="text-gray-700 text-base">{dataset.description.slice(0, 100)}</p>
	<a href="/report/{dataset.slug}"> <Button>View report</Button></a>
</Card>
