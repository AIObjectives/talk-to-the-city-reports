<script lang="ts">
	import { writable } from 'svelte/store';
	import {
		Handle,
		Position,
		useUpdateNodeInternals,
		useNodes,
		type NodeProps
	} from '@xyflow/svelte';
	import TextField from '@smui/textfield';
	import Button from '@smui/button';
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

<DGNode {id} {data} {selected}>
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
</DGNode>

<style>
	.key-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 8px;
	}
</style>
