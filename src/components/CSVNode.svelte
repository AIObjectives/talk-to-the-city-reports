<script lang="ts">
	import {
		getStorage,
		ref as storageRef,
		uploadBytesResumable,
		getDownloadURL
	} from 'firebase/storage';
	import { getAuth } from 'firebase/auth';
	import Button from '@smui/button';
	import Paper from '@smui/paper';
	import { Position, Handle, type NodeProps } from '@xyflow/svelte';
	import { page } from '$app/stores';

	type $$Props = NodeProps;

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

	export let data: $$Props['data'];

	let fileInput;
	const storage = getStorage();
	const auth = getAuth();

	function triggerFileSelect() {
		fileInput.click();
	}

	async function handleFileChange(event: Event) {
		const uploadedFile = (event.target as HTMLInputElement).files[0];
		if (!uploadedFile) return;

		const userId = auth.currentUser.uid;
		const filePath = `uploads/${userId}/${$page.params.report}/${uploadedFile.name}`;
		const fileRef = storageRef(storage, filePath);

		let reader = new FileReader();
		reader.onload = function (e) {
			data.csv = e.target.result;
			const uploadTask = uploadBytesResumable(fileRef, uploadedFile);
			uploadTask.on(
				'state_changed',
				(snapshot) => {
					// Handle progress...
				},
				(error) => {
					console.error('Upload failed', error);
				},
				async () => {
					await getDownloadURL(uploadTask.snapshot.ref);
					data.gcs_path = filePath;
					data.filename = uploadedFile.name;
					data.size_kb = uploadedFile.size / 1000;
					data.dirty = true;
				}
			);
		};
		reader.readAsText(uploadedFile, 'UTF-8');
	}
</script>

<Paper title={id} class={selected ? 'selected-node' : ''}>
	<div>CSV data</div>
	{#if data.filename}
		<div>{data.filename}</div>
		<div>{data.size_kb} KB</div>
		<small style="color: gray">{data.gcs_path}</small>
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
