<script lang="ts">
	import { writable } from 'svelte/store';
	import { type NodeProps } from '@xyflow/svelte';
	import TextField from '@smui/textfield';
	import Button from '@smui/button';
	import { useUpdateNodeInternals } from '@xyflow/svelte';
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

	// Create writable stores and initialize with data values
	const generateStore = writable(Object.entries(data.generate || {}));
	const deleteStore = writable(data.delete || []);
	const renameStore = writable(Object.entries(data.rename || {}));

	// Subscribe to store changes and update data object
	generateStore.subscribe((value) => {
		data.generate = Object.fromEntries(value);
		updateNodeInternals(id);
	});

	deleteStore.subscribe((value) => {
		data.delete = value;
		updateNodeInternals(id);
	});

	renameStore.subscribe((value) => {
		data.rename = Object.fromEntries(value);
		updateNodeInternals(id);
	});

	// Function to handle CSV action updates
	function updateCSVAction(store, action, index, value) {
		store.update((items) => {
			if (action === 'add') {
				const isObjectStore = store === generateStore || store === renameStore;
				data.dirty = true;
				return [...items, isObjectStore ? ['', ''] : ''];
			} else if (action === 'remove') {
				data.dirty = true;
				return items.filter((_, i) => i !== index);
			} else if (action === 'update') {
				items[index] = value;
				data.dirty = true;
				return items;
			}
		});
	}
</script>

<DGNode {id} {data} {selected}>
	<div>{data.label}</div>
	<br /><br />
	<p>Generate Columns</p>
	{#each $generateStore as item, index}
		<div class="csv-action-item">
			<TextField
				style="width: 35%;"
				helperLine$style="width: 35%;"
				class="nodrag"
				type="text"
				on:keydown={(evt) => {
					if (evt.key === 'Backspace') {
						evt.stopPropagation();
					}
				}}
				on:input={(evt) =>
					updateCSVAction(generateStore, 'update', index, [evt.target?.value, item[1]])}
				value={item[0]}
				placeholder="Column Name"
			/>
			<TextField
				style="width: 35%;"
				helperLine$style="width: 35%;"
				class="nodrag"
				type="text"
				on:keydown={(evt) => {
					if (evt.key === 'Backspace') {
						evt.stopPropagation();
					}
				}}
				on:input={(evt) =>
					updateCSVAction(generateStore, 'update', index, [item[0], evt.target?.value])}
				value={item[1]}
				placeholder="Value"
			/>
			<Button on:click={() => updateCSVAction(generateStore, 'remove', index)}>Remove</Button>
		</div>
	{/each}
	<Button on:click={() => updateCSVAction(generateStore, 'add')}>Add Generate Column</Button>

	<br /><br />
	<p>Delete Columns</p>
	{#each $deleteStore as item, index}
		<div class="csv-action-item">
			<TextField
				style="width: 80%;"
				helperLine$style="width: 80%;"
				class="nodrag"
				type="text"
				on:keydown={(evt) => {
					if (evt.key === 'Backspace') {
						evt.stopPropagation();
					}
				}}
				on:input={(evt) => updateCSVAction(deleteStore, 'update', index, evt.target?.value)}
				value={item}
			/>
			<Button on:click={() => updateCSVAction(deleteStore, 'remove', index)}>Remove</Button>
		</div>
	{/each}
	<Button on:click={() => updateCSVAction(deleteStore, 'add')}>Add Delete Column</Button>

	<br /><br />
	<p>Rename Columns</p>
	{#each $renameStore as item, index}
		<div class="csv-action-item">
			<TextField
				style="width: 35%;"
				helperLine$style="width: 35%;"
				class="nodrag"
				type="text"
				on:keydown={(evt) => {
					if (evt.key === 'Backspace') {
						evt.stopPropagation();
					}
				}}
				on:input={(evt) =>
					updateCSVAction(renameStore, 'update', index, [evt.target?.value, item[1]])}
				value={item[0]}
				placeholder="Original Name"
			/>
			<TextField
				style="width: 35%;"
				helperLine$style="width: 35%;"
				class="nodrag"
				type="text"
				on:keydown={(evt) => {
					if (evt.key === 'Backspace') {
						evt.stopPropagation();
					}
				}}
				on:input={(evt) =>
					updateCSVAction(renameStore, 'update', index, [item[0], evt.target?.value])}
				value={item[1]}
				placeholder="New Name"
			/>
			<Button on:click={() => updateCSVAction(renameStore, 'remove', index)}>Remove</Button>
		</div>
	{/each}
	<Button on:click={() => updateCSVAction(renameStore, 'add')}>Add Rename Column</Button>
</DGNode>

<style>
	.csv-action-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 8px;
	}
</style>
