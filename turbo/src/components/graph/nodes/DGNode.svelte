<script lang="ts">
	import Checkbox from '@smui/checkbox';
	import FormField from '@smui/form-field';
	import Tune from '$lib/icons/Tune.svelte';
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
	import TuneDGNode from './dgnode/TuneDGNode.svelte';
	import { getContext } from 'svelte';
	import { onMount } from 'svelte';
	import _ from 'lodash';
	import { useSvelteFlow } from '@xyflow/svelte';
	import { useUpdateNodeInternals } from '@xyflow/svelte';
	import { Dataset } from '$lib/dataset';
	import Card from '@smui/card';
	let viewMode = getContext('viewMode');

	const updateNodeInternals = useUpdateNodeInternals();

	const { flowToScreenPosition, getZoom } = useSvelteFlow();
	const dataset: Dataset = getContext('dataset');
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
	export let positionAbsolute;

	let divHeight = 0;
	let divWidth = 0;

	$: posY = positionAbsolute?.y ? flowToScreenPosition(positionAbsolute)?.y : 0;
	let rects = {};
	let mounted = false;

	onMount(() => {
		updateRects();
		mounted = true;
	});

	$: {
		const node = $nodes.find((node) => node.id === id);
		if (mounted && node) {
			node.width = divWidth > 500 ? divWidth : 500;
			node.height = divHeight;
		}
	}

	function updateRects() {
		rects = {};
		_.keys(data.input_ids).forEach((inputId) => {
			const element = document.getElementById(`input-${id}-${inputId}`);
			if (element) {
				const rect = element.getBoundingClientRect();
				rects[`input-${id}-${inputId}`] = Math.round((rect.top - posY) / getZoom());
			}
		});
		// Currently only one output is supported
		if (data.output_ids) {
			_.keys(data.output_ids).forEach((outputId) => {
				const element = document.getElementById(`output-${id}-${outputId}`);
				if (element) {
					const rect = element.getBoundingClientRect();
					rects[`output-${id}-${outputId}`] = Math.round((rect.top - posY) / getZoom());
				}
			});
		}
	}

	$: if (data.input_ids) {
		divHeight;
		if (positionAbsolute) {
			updateNodeInternals(id);
			updateRects();
		}
	}

	const getDocs = async (locale) => {
		doc = await register.getDocs(data.compute_type, locale);
		inlineDoc = await register.getInlineDocs(data.compute_type, locale);
	};

	function onConnect(x) {
		let { source, target, sourceHandle, targetHandle } = x.detail.connection;
		console.log('onConnect', x.detail);
		dataset?.graph.onConnect(source, target, sourceHandle, targetHandle);
	}

	$: variant = isStandardView ? 'raised' : 'outlined';
	$: show = isStandardView ? data.show_in_ui === undefined || data.show_in_ui === true : true;
	let dg_node = dataset?.graph.find(id);
	let show_help = false;
	let has_all_inputs = true;
	let doc;
	let inlineDoc;
	let tune = false;
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
</script>

{#if data && show}
	<div bind:clientHeight={divHeight} bind:clientWidth={divWidth}>
		<Paper
			color={isStandardView ? 'default' : color}
			variant={isStandardView ? 'raised' : variant}
			title={data?.compute_type}
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
				{#if !isStandardView}
					<button
						on:click={() => {
							tune = !tune;
						}}><Tune color="gray" /></button
					>&nbsp;&nbsp;
					{#if !has_all_inputs}
						<Connection color="#ffaaaa" class="mr-2" />
					{/if}
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
			{#if tune}
				<TuneDGNode {data} />
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
			{#if _.isBoolean(data.enable)}
				<FormField align="end">
					<span
						><Checkbox
							checked={data.enable === true}
							on:change={(x) => {
								data.enable = x.target.checked;
							}}
						/></span
					>
					<span slot="label">{$__('enable')}</span>
				</FormField>
			{/if}
			{#if !isStandardView}
				{#each _.keys(data.input_ids) as inputId, i}
					<Card style="min-height: 50px; padding: 10px;">
						<div
							id={`input-${id}-${inputId}`}
							title={`top: ${rects[`input-${id}-${inputId}`] + 10}px;`}
						>
							<p>{$__('input')}: {inputId}</p>
						</div>
					</Card>
				{/each}
				<!-- Currently only one output is supported -->
				{#if data.output_ids}
					{#each _.keys(data.output_ids) as outputId, i}
						<Card style="min-height: 50px; padding: 10px;">
							<div
								id={`output-${id}-${outputId}`}
								title={`top: ${rects[`output-${id}-${outputId}`] + 10}px;`}
							>
								<p style="float: right;">{$__('output')}: {outputId}</p>
							</div>
						</Card>
					{/each}
				{/if}
			{/if}
		</Paper>
	</div>
	{#if !isStandardView}
		{#each _.keys(data.input_ids) as inputId}
			{#if rects[`input-${id}-${inputId}`]}
				<Handle
					id={inputId}
					type="target"
					position={Position.Left}
					on:connect={onConnect}
					style={`top: ${rects[`input-${id}-${inputId}`] + 10}px;`}
				/>
			{/if}
		{/each}
		{#if data.output_ids}
			{#each _.keys(data.output_ids) as outputId}
				{#if rects[`output-${id}-${outputId}`]}
					<Handle
						id={outputId}
						type="source"
						position={Position.Right}
						on:connect={onConnect}
						style={`top: ${rects[`output-${id}-${outputId}`] + 10}px;`}
					/>
				{/if}
			{/each}
		{:else}
			<Handle type="source" position={Position.Right} on:connect={onConnect} />
		{/if}
	{/if}
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
