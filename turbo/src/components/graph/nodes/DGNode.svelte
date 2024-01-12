<script lang="ts">
	import Paper from '@smui/paper';
	import { marked } from 'marked';
	import Help from '$lib/icons/HelpCircle.svelte';
	import type { BaseData } from '$lib/node_data_types';
	import { Position, Handle } from '@xyflow/svelte';
	import Connection from '$lib/icons/Connection.svelte';
	import { useNodes } from '@xyflow/svelte';
	import { _ as __ } from 'svelte-i18n';
	import register from '$lib/node_register';
	import Cookies from 'js-cookie';
	import { getContext } from 'svelte';

	const dataset = getContext('dataset');
	const nodes = useNodes();

	export let data: BaseData;
	export let id: string;
	export let selected: boolean = false;
	export let style: string = '';
	export let type: string = '';
	export let width: number = 0;
	export let height: number = 0;
	export let isStandardView: boolean = false;
	export let color = '';
	export let variant = 'raised';
	export let _class = '';

	const getDocs = async (locale) => {
		doc = await register.getDocs(data.compute_type, locale);
		inlineDoc = await register.getInlineDocs(data.compute_type, locale);
	};

	function onConnect(x) {
		let { source, target } = x.detail.connection;
		dataset?.graph.onConnect(source, target);
	}

	$: variant = isStandardView ? 'raised' : 'outlined';
	$: show = isStandardView ? data.show_in_ui === undefined || data.show_in_ui === true : true;
	let dg_node = dataset?.graph.find(id);
	let show_help = false;
	let has_all_inputs = true;
	let doc;
	let inlineDoc;
	$: {
		const locale = Cookies.get('locale') || 'en-US';
		getDocs(locale);
		if (dg_node) {
			$nodes;
			selected;
			has_all_inputs = dg_node.hasAllInputs;
		}
	}
	let _style = `position: relative; ${style}; `;

	if (width && height) {
		_style += `min-width: ${width}px; min-height: ${height}px;`;
	}
</script>

{#if data && show}
	<Paper
		color={isStandardView ? 'default' : color}
		variant={isStandardView ? 'raised' : variant}
		title={id}
		class={(selected ? 'selected-dg-node' : 'dg-node') + ' ' + _class}
		style={_style}
	>
		{#if data?.icon}
			<div style="float: left; margin-right: 0.5rem;" class="w-6 h-6">
				<!-- svelte-ignore a11y-missing-attribute -->
				<img
					style="width: 100%; height: 100%; object-fit: contain;"
					src="/{data.icon}.png"
					class="w-6 h-6"
				/>
			</div>
		{/if}

		<div>
			{$__(data.label)}
			{#if !isStandardView}<small class="mb-4 text-gray-400">{id}</small>{/if}
		</div>

		<div class="help-icon-wrapper">
			{#if !isStandardView && !has_all_inputs}
				<Connection color="#ffaaaa" class="mr-2" />
			{/if}
			{#if doc}
				<button on:click={() => (show_help = !show_help)}><Help color="gray" /></button>
			{/if}
		</div>
		{#if show_help}
			<Paper class="mb-5" style="min-width: 500px;">
				<div class="docs">
					<h3>{data.compute_type} {$__('node_documentation')}</h3>
					{@html marked.parse(doc)}
				</div>
			</Paper>
		{/if}
		{#if isStandardView && inlineDoc}
			<div class="text-sm text-gray-900 my-5">{@html marked.parse(inlineDoc)}</div>
		{/if}
		<slot />
		{#if data?.dirty}
			<div class="text-sm text-gray-500">{$__('unsaved_changes')}</div>
		{/if}
		{#if data?.message}
			<div class="text-sm text-gray-500">{@html data?.message}</div>
		{/if}
	</Paper>

	<Handle type="source" position={Position.Bottom} on:connect={onConnect} />
	<Handle
		type="target"
		position={Position.Top}
		on:connect={onConnect}
		style={'background-color: ' + (has_all_inputs ? 'rgb(200, 203, 223)' : '#ffaaaa')}
	/>
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
	.help-icon-wrapper {
		position: absolute;
		top: 10px;
		right: 10px;
		display: flex;
		align-items: center;
	}
</style>
