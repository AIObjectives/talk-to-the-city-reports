<script lang="ts">
  import _ from 'lodash';
  import AgGridSvelte from 'ag-grid-svelte';
  import { writable, get } from 'svelte/store';

  export let isStandardView: boolean;
  export let data: Array<{ [key: string]: any }>;
  export let depth = 0;
  export let id;

  let columnApi: any;
  let gridApi: any;
  let columnDefs: Array<{ [key: string]: any }> = [];
  let gridData: any;

  $: {
    if (data) {
      if (_.isArray(data) && data.length > 0) {
        columnDefs = _.keys(data[0]).map((key) => ({ field: key, editable: true }));
        gridData = data;
      } else if (_.isObject(data)) {
        const first_key = _.keys(data)[0];
        const first_obj = data[first_key];
        if (_.isArray(first_obj) && first_obj.length > 0) {
          columnDefs = _.keys(first_obj[0]).map((key) => ({
            field: key,
            editable: true
          }));
          gridData = first_obj;
        }
      }
    }
  }
  let columnWidths = writable({});
  let storage_key = 'columnWidths' + id + '_' + isStandardView;

  if (localStorage.getItem(storage_key)) {
    columnWidths.set(JSON.parse(localStorage.getItem(storage_key)));
  }

  $: if (gridApi) gridApi.refreshCells();

  function onColumnResized(params) {
    if (params.source === 'api' || params.source == 'flex') {
      return;
    }
    if (params.finished) {
      let newColumnWidths = {};
      params.columnApi.getAllColumns().forEach((column) => {
        newColumnWidths[column.getColId()] = column.getActualWidth();
      });
      columnWidths.set(newColumnWidths);
      localStorage.setItem(storage_key, JSON.stringify(newColumnWidths));
    }
  }

  function onGridReady(event: { columnApi: any; api: any }): void {
    columnApi = event.columnApi;
    gridApi = event.api;
    const storedColumnWidths = get(columnWidths);
    for (const colId in storedColumnWidths) {
      columnApi.setColumnWidth(colId, Math.min(storedColumnWidths[colId], 1000), true);
    }
  }
</script>

{#if gridData}
  <div style="width: 100%;" class={'ag-theme-alpine ml-' + depth * 5}>
    <AgGridSvelte
      pagination={gridData.length > 10}
      paginationPageSize={10}
      paginationAutoPageSize={false}
      rowData={gridData}
      {columnDefs}
      defaultColDef={{ flex: 0, resizable: true }}
      domLayout={isStandardView ? 'autoHeight' : 'print'}
      alwaysShowHorizontalScroll={false}
      suppressHorizontalScroll={true}
      scrollbarWidth={0}
      suppressDragLeaveHidesColumns={true}
      suppressRowDrag={true}
      suppressMovable={true}
      {onColumnResized}
      {onGridReady}
    />
  </div>
{/if}

<style>
  :root {
    width: 100%;
  }
  .grid-container {
    width: 100%;
  }
  :global(
      .ag-theme-alpine .ag-layout-auto-height .ag-center-cols-clipper,
      .ag-theme-alpine .ag-layout-auto-height .ag-center-cols-container,
      .ag-theme-alpine .ag-layout-print .ag-center-cols-clipper,
      .ag-theme-alpine .ag-layout-print .ag-center-cols-container,
      .ag-theme-alpine-dark .ag-layout-auto-height .ag-center-cols-clipper,
      .ag-theme-alpine-dark .ag-layout-auto-height .ag-center-cols-container,
      .ag-theme-alpine-dark .ag-layout-print .ag-center-cols-clipper,
      .ag-theme-alpine-dark .ag-layout-print .ag-center-cols-container
    ) {
    min-height: auto !important; /* Clears out any previously set min-height */
  }
</style>
