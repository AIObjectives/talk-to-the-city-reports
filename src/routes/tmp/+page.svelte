<script lang="ts">
	import GridNested from '$components/GridNested.svelte';

	let data = [
		{
			name: 'test',
			nestedData: [
				{ detail: 'Detail 1', value: 'Value 1' },
				{ detail: 'Detail 2', value: 'Value 2' }
			]
		}
	];
</script>

{#if data && data.length}
	<GridNested {data} />
{/if}
