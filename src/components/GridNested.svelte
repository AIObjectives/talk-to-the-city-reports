<script lang="ts">
	import Grid from '$components/Grid.svelte';
	import _ from 'lodash';

	export let data: Array<{ [key: string]: any }>;

	let currentPage = 1;
	const itemsPerPage = 10;

	function hasNestedData(item) {
		return Object.values(item).some((value) => Array.isArray(value));
	}

	function getNestedData(item) {
		return Object.values(item).find((value) => Array.isArray(value)) || [];
	}

	function convertData(d) {
		let mData = [];
		let iWn = [];
		d.forEach((row) => {
			if (hasNestedData(row)) {
				if (iWn.length > 0) {
					mData.push({ data: iWn, indent: false });
					iWn = [];
				}
				let rowItems = _.pickBy(row, (value) => !_.isArray(value));
				mData.push({ data: [rowItems], indent: false });
				mData.push({ data: getNestedData(row), indent: true });
			} else {
				iWn.push(row);
			}
		});
		if (iWn.length > 0) {
			mData.push({ data: iWn, indent: false });
		}
		return mData;
	}

	$: modData = convertData(data);
	$: totalPages = Math.ceil(modData.length / itemsPerPage);

	function changePage(newPage) {
		if (newPage >= 1 && newPage <= totalPages) {
			currentPage = newPage;
		}
	}
</script>

{#if modData && modData.length}
	{#if totalPages > 1}
		<button on:click={() => changePage(currentPage - 1)}>Previous</button>
		<button on:click={() => changePage(currentPage + 1)}>Next</button>
	{/if}
	{#each modData as item, index (item)}
		{#if index >= (currentPage - 1) * itemsPerPage && index < currentPage * itemsPerPage}
			{#if item.indent}
				<div class={item.indent ? 'ml-5' : ''}>
					<svelte:self data={item.data} />
				</div>
			{:else}
				<Grid data={item.data} />
			{/if}
		{/if}
	{/each}
{/if}
