<script lang="ts">
  import { page } from '$app/stores';
  import { _ as __ } from 'svelte-i18n';
  import Button, { Label } from '@smui/button';
  import Select, { Option } from '@smui/select';
  import { type NodeProps } from '@xyflow/svelte';
  import DGNode from './DGNode.svelte';

  type $$Props = NodeProps;

  export let data: $$Props['data'];
  export let id: $$Props['id'];
  let formats = ['json', 'csv'];
  let format = 'csv';

  $: name = $page?.params?.report || id;

  function downloadJSON() {
    const filename = `${name}.json`;
    const jsonStr = JSON.stringify(data.output, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    downloadBlob(blob, filename);
  }

  function objectsToCsv(data) {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return null;
    }

    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(',')]; // Initialize with headers

    for (const row of data) {
      const values = headers.map((header) => {
        let cell = row[header];
        cell = cell !== null && cell !== undefined ? cell.toString() : ''; // Convert to string, handle null and undefined
        if (cell.includes('"')) {
          cell = cell.replace(/"/g, '""'); // Escape double quotes
        }
        if (cell.search(/("|,|\n)/g) >= 0) {
          cell = `"${cell}"`; // Quote fields with commas, newlines, or quotes
        }
        return cell;
      });
      csvRows.push(values.join(','));
    }

    const csvString = csvRows.join('\n');
    return csvString;
  }

  function downloadCSV() {
    const filename = `${name}.csv`;
    const csvStr = objectsToCsv(data.output);
    const blob = new Blob([csvStr], { type: 'text/csv;charset=utf-8;' });
    downloadBlob(blob, filename);
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  function downloadData() {
    const funcs = {
      json: downloadJSON,
      csv: downloadCSV
    };
    funcs[format]();
  }
</script>

<DGNode {data} {id} {...$$restProps}>
  <Select bind:value={format} label={$__('format')}>
    {#each formats as formatOption}
      <Option value={formatOption}>{formatOption}</Option>
    {/each}
  </Select>
  <br />
  <Button on:click={downloadData} class="mt-5">
    <Label>{$__('download')}</Label>
  </Button>
</DGNode>
