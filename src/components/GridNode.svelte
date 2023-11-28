<script lang="ts">
	import { Handle, Position, type NodeProps } from '@xyflow/svelte';
	import DGNode from '$components/DGNode.svelte';
	import AgGridSvelte from 'ag-grid-svelte';
	import { onMount } from 'svelte';

	type $$Props = NodeProps;

	export let data: $$Props['data'];

	export let id;
	export let zIndex;
	export let dragging;
	export let dragHandle;
	export let isConnectable;
	export let type;
	export let xPos;
	export let yPos;
	export let selected;
	export let sourcePosition;
	export let targetPosition;

	let columnApi: any;
	let gridApi: any;
	let columnDefs: any[] = [];

	$: {
		columnDefs =
			data.output && data.output.length
				? Object.keys(data.output[0]).map((key) => ({ field: key, editable: true }))
				: [];
	}
	$: if (gridApi) gridApi.refreshCells();

	function autoSizeColumns(): void {
		if (columnApi) {
			setTimeout(() => {
				columnApi.autoSizeAllColumns();
			}, 100);
		}
	}

	function onGridReady(event: { columnApi: any; api: any }): void {
		columnApi = event.columnApi;
		gridApi = event.api;
		autoSizeColumns();
	}

	onMount(() => {
		autoSizeColumns();
	});

	console.log(data);
</script>

<DGNode {id} {data} {selected}>
	<div>{data.label}</div>
	{#if data.output && Array.isArray(data.output) && data.output.length}
		<div class="ag-theme-alpine grid">
			<AgGridSvelte
				rowData={data.output}
				{columnDefs}
				defaultColDef={{ flex: 1, minWidth: 100 }}
				{onGridReady}
			/>
		</div>
	{/if}
	<Handle type="target" position={Position.Top} />
	<Handle type="source" position={Position.Bottom} />
</DGNode>

<style>
	.grid {
		min-width: 500px;
		min-height: 300px;
		max-height: 300px;
	}
</style>
