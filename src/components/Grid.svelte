<script lang="ts">
	import AgGridSvelte from 'ag-grid-svelte';
	import { onMount } from 'svelte';

	export let data: Array<{ [key: string]: any }>;
	export let depth = 0;

	let columnApi: any;
	let gridApi: any;
	let columnDefs: Array<{ [key: string]: any }> = [];
	let gridData;

	$: {
		if (data) {
			if (Array.isArray(data) && data.length > 0) {
				columnDefs = Object.keys(data[0]).map((key) => ({ field: key, editable: true }));
				gridData = data;
			} else if (typeof data === 'object') {
				const first_key = Object.keys(data)[0];
				const first_obj = data[first_key];
				if (Array.isArray(first_obj) && first_obj.length > 0) {
					columnDefs = Object.keys(first_obj[0]).map((key) => ({ field: key, editable: true }));
					gridData = first_obj;
				}
			}
		}
	}

	$: if (gridApi) gridApi.refreshCells();

	function autoSizeColumns(): void {
		if (columnApi) {
			setTimeout(() => {
				columnApi.sizeColumnsToFit(800);
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
</script>

{#if gridData}
	<div style="min-width: 700px;" class={'ag-theme-alpine ml-' + depth * 5}>
		<AgGridSvelte
			pagination={gridData.length > 10}
			paginationPageSize={10}
			paginationAutoPageSize={false}
			rowData={data}
			{columnDefs}
			defaultColDef={{ flex: 1, minWidth: 100 }}
			domLayout="autoHeight"
			alwaysShowHorizontalScroll={false}
			suppressHorizontalScroll={true}
			scrollbarWidth={0}
			{onGridReady}
		/>
	</div>
{/if}
