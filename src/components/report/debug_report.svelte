<script lang="ts">
	export let dataset: any;
	export let report_node;
	export let csv_node;
	export let report;
	export let csv;
</script>

{#if dataset}
	<p style="text-align: center">Dataset present.</p>
{:else}
	<p style="text-align: center; color: red;">Dataset missing.</p>
{/if}
{#if report_node}
	<p style="text-align: center">Report node present.</p>
{:else}
	<p style="text-align: center; color: red;">Report node missing.</p>
{/if}
{#if csv_node}
	<p style="text-align: center">CSV node present.</p>
{:else}
	<p style="text-align: center; color: red;">CSV node missing.</p>
{/if}
{#if report}
	<p style="text-align: center">Report present.</p>
{:else}
	<p style="text-align: center; color: red;">Report missing.</p>
{/if}
{#if csv}
	<p style="text-align: center">CSV present.</p>
{:else}
	<p style="text-align: center; color: red;">CSV missing.</p>
{/if}
