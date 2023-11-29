<script lang="ts">
	import { Handle, Position, type NodeProps } from '@xyflow/svelte';
	import DGNode from './DGNode.svelte';
	import AgGridSvelte from 'ag-grid-svelte';
	import { onMount } from 'svelte';

	type $$Props = NodeProps;

	export let data: $$Props['data'];
	export let id: $$Props['id'];
	export let zIndex: $$Props['zIndex'];
	export let dragging: $$Props['dragging'];
	export let dragHandle: $$Props['dragHandle'];
	export let isConnectable: $$Props['isConnectable'];
	export let type: $$Props['type'];
	export let positionAbsolute: $$Props['positionAbsolute'];
	export let width: $$Props['width'];
	export let height: $$Props['height'];
	export let selected: $$Props['selected'];
	export let sourcePosition: $$Props['sourcePosition'];
	export let targetPosition: $$Props['targetPosition'];

	let columnApi: any;
	let gridApi: any;
	let columnDefs: any[] = [];
	let gridData: any;

	$: {
		if (data.output) {
			if (typeof data.output === 'object') {
				const first_key = Object.keys(data.output)[0];
				const first_obj = data.output[first_key];
				if (Array.isArray(first_obj) && first_obj.length > 0) {
					columnDefs = Object.keys(first_obj[0]).map((key) => ({ field: key, editable: true }));
					gridData = first_obj;
				}
			} else if (Array.isArray(data.output) && data.output.length > 0) {
				columnDefs = Object.keys(data.output[0]).map((key) => ({ field: key, editable: true }));
				gridData = data.output;
			}
		}
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

	console.log(gridData);
</script>

<DGNode {id} {data} {selected}>
	<div>{data.label}</div>
	{#if gridData && Array.isArray(gridData)}
		<div class="ag-theme-alpine grid">
			<AgGridSvelte
				rowData={gridData}
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
