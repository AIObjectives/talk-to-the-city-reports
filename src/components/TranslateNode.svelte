<script lang="ts">
	import { writable } from 'svelte/store';
	import { Handle, Position, type NodeProps } from '@xyflow/svelte';
	import TextField from '@smui/textfield';
	import Paper from '@smui/paper';
	import Button from '@smui/button';
	import { useUpdateNodeInternals, useNodes } from '@xyflow/svelte';

	type $$Props = NodeProps;

	export let data: $$Props['data'];
	export let id;

	const updateNodeInternals = useUpdateNodeInternals();
	const nodes = useNodes();

	// Writable store for keys
	const keysStore = writable(data.keys);

	// Syncing store with data.keys
	keysStore.subscribe((keys) => {
		data.keys = keys;
		updateNodeInternals(id);
		$nodes = $nodes; // Trigger reactivity
	});

	function addKey() {
		data.dirty = true;
		keysStore.update((keys) => [...keys, '']);
	}

	function removeKey(index: number) {
		data.dirty = true;
		keysStore.update((keys) => keys.filter((_, i) => i !== index));
	}

	function updateKey(index: number, value: string) {
		data.dirty = true;
		keysStore.update((keys) => {
			keys[index] = value;
			return keys;
		});
	}
</script>

<Paper title={id}>
	<div>{data.label}</div>
	<TextField
		style="width: 100%;"
		label="Target Language"
		helperLine$style="width: 100%;"
		class="nodrag"
		type="text"
		on:input={(evt) => {
			data.target_language = evt.target?.value;
			data.dirty = true;
			updateNodeInternals(id);
		}}
		value={data.target_language}
	/>
	<br /><br /><br />
	<p>Columns to translate</p>
	{#each $keysStore as key, index}
		<div class="key-item">
			<TextField
				style="width: 80%;"
				helperLine$style="width: 80%;"
				class="nodrag"
				type="text"
				on:input={(evt) => updateKey(index, evt.target?.value)}
				value={key}
			/>
			<Button on:click={() => removeKey(index)}>Remove</Button>
		</div>
	{/each}
	<Button on:click={addKey}>Add Key</Button>
	<small style="color: gray">{data.gcs_path}</small>
	{#if data.dirty}
		<div class="text-sm text-gray-500">Unsaved changes</div>
	{/if}
	<Handle type="target" position={Position.Top} />
	<Handle type="source" position={Position.Bottom} />
</Paper>

<style>
	.key-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 8px;
	}
</style>
