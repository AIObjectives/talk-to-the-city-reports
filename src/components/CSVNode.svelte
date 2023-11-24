<script lang="ts">
	import { Handle, Position, type NodeProps } from '@xyflow/svelte';
	import { type Writable } from 'svelte/store';
	import Button from '@smui/button';
	import Paper from '@smui/paper';

	type $$Props = NodeProps;

	export let data: { file: Writable<File | null> };
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

	let fileInput;

	function triggerFileSelect() {
		fileInput.click();
	}

	function handleFileChange(event) {
		const uploadedFile = event.target.files[0];
		if (uploadedFile) {
			let reader = new FileReader();
			reader.onload = function (e) {
				data.csv = e.target.result;
				data.filename = uploadedFile.name;
				data.size_kb = uploadedFile.size / 1000;
				data.dirty = true;
			};
			reader.readAsText(uploadedFile, 'UTF-8');
		}
	}
</script>

<Paper title={id}>
	<div>CSV data</div>
	{#if data.filename}
		<div>{data.filename}</div>
		<div>{data.size_kb} KB</div>
	{:else}
		<input
			class="nodrag"
			type="file"
			bind:this={fileInput}
			on:change={handleFileChange}
			style="display: none;"
		/>
		<Button on:click={triggerFileSelect}>Upload CSV</Button>
	{/if}
	{#if data.dirty}
		<div class="text-sm text-gray-500">Unsaved changes</div>
	{/if}

	<Handle type="source" position={Position.Bottom} />
</Paper>
