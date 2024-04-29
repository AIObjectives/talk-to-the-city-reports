<script lang="ts">
  import { type NodeProps } from '@xyflow/svelte';
  import AgGridSvelte from 'ag-grid-svelte';
  import DGNode from './DGNode.svelte';
  import _ from 'lodash';
  import { _ as __ } from 'svelte-i18n';

  type $$Props = NodeProps;

  export let isStandardView: boolean = false;
  export let data: $$Props['data'];
  export let id: $$Props['id'];

  const columnDefs = [
    { field: 'dirty', editable: true, type: 'boolean' },
    { field: 'filename', editable: false },
    { field: 'interview', editable: true },
    { field: 'video', editable: true },
    { field: 'prompt', editable: true },
    { field: 'language', editable: true },
    { field: 'response_format', editable: true },
    { field: 'temperature', editable: true }
  ];
  let tableData;

  $: {
    // this only works by side-effect, i.e tableData still binds to the same reference
    tableData = _.values(data.node_info);
  }
</script>

<DGNode {data} {id} {...$$restProps}>
  {#if !_.isEmpty(data.node_info)}
    <div style="width: 100%;" class={'ag-theme-alpine'}>
      <AgGridSvelte
        pagination={false}
        rowData={tableData}
        {columnDefs}
        defaultColDef={{ flex: 0, resizable: true }}
        domLayout={'autoHeight'}
        alwaysShowHorizontalScroll={false}
        suppressHorizontalScroll={true}
        scrollbarWidth={0}
        suppressDragLeaveHidesColumns={true}
        suppressRowDrag={true}
        suppressMovable={true}
        cellValueChanged={({ data }) => {
          console.log('cell value changed');
          data.dirty = true;
          data.node_info[data.filename] = data;
        }}
      />
    </div>
  {/if}
</DGNode>

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
