<script lang="ts">
	import {
		getStorage,
		ref as storageRef,
		uploadBytesResumable,
		getDownloadURL
	} from 'firebase/storage';
	import { useNodes } from '@xyflow/svelte';
	import { getAuth } from 'firebase/auth';
	import Button from '@smui/button';
	import { type NodeProps } from '@xyflow/svelte';
	import { page } from '$app/stores';
	import DGNode from './DGNode.svelte';
	import { _ as __ } from 'svelte-i18n';
	import TrashCan from '$lib/icons/TrashCan.svelte';

	type $$Props = NodeProps;

	export let data: $$Props['data'];
	export let id: $$Props['id'];
	export let fileType = 'CSV';

	const nodes = useNodes();
	let fileInput;
	const storage = getStorage();
	const auth = getAuth();

	async function handleFileChange(event: Event) {
		const uploadedFile = (event.target as HTMLInputElement).files[0];
		if (!uploadedFile) return;

		const userId = auth.currentUser.uid;
		const filePath = `uploads/${userId}/${$page.params.report}/${id}_${uploadedFile.name}`;
		const fileRef = storageRef(storage, filePath);

		let reader = new FileReader();
		reader.onload = function (e) {
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
					$nodes = $nodes;
					for (const node of $nodes) {
						node.data = { ...node.data };
					}
				}
			);
		};
		reader.readAsText(uploadedFile, 'UTF-8');
	}
</script>

<DGNode {data} {id} {...$$restProps}>
	<div>
		<span>{fileType} {$__('data')}</span>
		{#if data?.filename}
			<div class="filename-container">
				<span class="filename">{data?.filename}</span>
				<span class="file-size">{data?.size_kb} KB</span>
				<small class="gcs-path ml-2" style="color: gray">{data?.gcs_path}</small>
				<div class="trashcan-container">
					<button on:click={() => {
						data.gcs_path = null;
						data.filename = null;
						data.size_kb = null;
						data.dirty = false;
					}}><TrashCan color='#777'/></button>
				</div>
			</div>
		{:else}
			<input
				class="nodrag"
				type="file"
				bind:this={fileInput}
				on:change={handleFileChange}
				style="display: none;"
			/>
			<Button on:click={() => fileInput.click()}>{$__('upload')} {fileType}</Button>
		{/if}
	</div>
</DGNode>

<style>
	.filename-container {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.trashcan-container {
		flex: 1;
		display: flex;
		justify-content: flex-end;
	}
</style>
