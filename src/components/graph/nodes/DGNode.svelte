<script lang="ts">
	import Checkbox from '@smui/checkbox';
	import FormField from '@smui/form-field';
	import Paper from '@smui/paper';
	import { marked } from 'marked';
	import { docs } from '$lib/node_types';
	import Help from '$lib/icons/HelpCircle.svelte';
	import type { BaseData } from '$lib/node_data_types';
	import { Position, Handle } from '@xyflow/svelte';
	import { dataset } from '$lib/store';
	import Connection from '$lib/icons/Connection.svelte';
	import { useNodes } from '@xyflow/svelte';
	import { _ as __ } from 'svelte-i18n';

	const nodes = useNodes();

	export let data: BaseData;
	export let id: string;
	export let selected: boolean;
	export let style: string = '';
	export let type: string = '';
	export let isStandardView: boolean = false;

	function onConnect(x) {
		let { source, target } = x.detail.connection;
		$dataset?.graph.onConnect(source, target);
	}

	$: show = isStandardView ? data.show_in_ui === undefined || data.show_in_ui === true : true;
	let dg_node = $dataset?.graph.find(id);
	let show_help = false;
	let has_all_inputs = true;
	$: {
		if (dg_node) {
			$nodes; // trigger reactivity
			selected; // trigger reactivity
			has_all_inputs = dg_node.hasAllInputs;
		}
	}
</script>

{#if data && show}
	<Paper title={id} class={selected ? 'selected-dg-node' : 'dg-node'} {style}>
		{#if data?.icon}
			<div style="float: left; margin-right: 0.5rem;" class="w-6 h-6">
				<img
					style="width: 100%; height: 100%; object-fit: contain;"
					src="/{data.icon}.png"
					class="w-6 h-6"
				/>
			</div>
		{/if}
		<div class="mb-4">{$__(data.label)}</div>

		<div style="float: right; display: flex; justify-content: flex-end;">
			{#if !has_all_inputs}
				<Connection color="#ffaaaa" class="mr-2" />
			{/if}
			{#if docs[data?.compute_type]}
				<button on:click={() => (show_help = !show_help)}><Help color="gray" /></button>
			{/if}
		</div>
		{#if show_help}
			<Paper class="mb-5" style="min-width: 500px;">
				<div class="docs">
					{@html marked.parse(docs[data?.compute_type])}
				</div>
			</Paper>
		{/if}
		<slot />
		{#if data?.dirty}
			<div class="text-sm text-gray-500">{$__('unsaved_changes')}</div>
		{/if}
		{#if data?.message}
			<div class="text-sm text-gray-500">{data?.message}</div>
		{/if}

		<div>
			{#if !isStandardView}
				<FormField align="end">
					<span
						><Checkbox
							on:change={(x) => {
								data.show_in_ui = x.target.checked;
							}}
						/></span
					>
					<span slot="label">{$__('show_in_standard_view')}</span>
				</FormField>
			{/if}
		</div>

		<Handle type="source" position={Position.Bottom} on:connect={onConnect} />
		<Handle
			type="target"
			position={Position.Top}
			on:connect={onConnect}
			style={'background-color: ' + (has_all_inputs ? 'rgb(200, 203, 223)' : '#ffaaaa')}
		/>
	</Paper>
{/if}

<style>
	:global(.svelte-flow .svelte-flow__handle) {
		width: 30px;
		height: 14px;
		border-radius: 3px;
		border-color: #3342a5;
		background-color: rgb(200, 203, 223);
	}

	:global(.svelte-flow .svelte-flow__handle-top) {
		top: -10px;
	}

	:global(.svelte-flow__edge-path) {
		stroke-width: 50;
		stroke: #ccccff;
	}

	:global(.svelte-flow__edge-interaction) {
		stroke-width: 50 !important;
		stroke: rgb(255, 0, 149) !important;
	}

	:global(.svelte-flow .svelte-flow__handle-bottom) {
		bottom: -10px;
	}

	:global(.svelte-flow .svelte-flow__edge path, .svelte-flow__connectionline path) {
		stroke-width: 3;
		stroke: rgb(185, 191, 220);
	}
</style>
