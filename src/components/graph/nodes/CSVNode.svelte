<script lang="ts">
	import {
		getStorage,
		ref as storageRef,
		uploadBytesResumable,
		getDownloadURL
	} from 'firebase/storage';
	import { getAuth } from 'firebase/auth';
	import Button from '@smui/button';
	import { Position, Handle, type NodeProps } from '@xyflow/svelte';
	import { page } from '$app/stores';
	import DGNode from './DGNode.svelte';

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

<DGNode {data} {id} {selected}>
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

	<Handle type="source" position={Position.Bottom} />
</DGNode>
