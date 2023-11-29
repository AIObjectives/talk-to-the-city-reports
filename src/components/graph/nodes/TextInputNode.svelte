<script lang="ts">
	import { Handle, Position, type NodeProps } from '@xyflow/svelte';
	import TextField from '@smui/textfield';
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

	const { text } = data;
</script>

<DGNode {data} {id} {selected}>
	<div>{data.label}</div>
	<TextField
		style="width: 100%;"
		helperLine$style="width: 100%;"
		class="nodrag"
		type="text"
		on:input={(evt) => {
			data.text = evt.target?.value;
			data.dirty = true;
		}}
		value={text}
	/>
	<Handle type="target" position={Position.Top} />
	<Handle type="source" position={Position.Bottom} />
</DGNode>
