<script lang="ts">
	import { _ as __ } from 'svelte-i18n';
	import CodeMirror from 'svelte-codemirror-editor';
	import { oneDark } from '@codemirror/theme-one-dark';
	import { javascript } from '@codemirror/lang-javascript';
	import { code } from '$lib/node_types';

	export let openId;
	export let openType;
	export let node;
	export let index;

	let co: string = '';
	let name: string = '';
	$: open = openId === node.id;
</script>

<div>
	{$__('step')}
	{index + 1}: <span class="mx-3">{$__(node.data.label)}</span>
	<button
		on:click={() => {
			co = code[node.data.compute_type];
			openId = node.id;
			openType = 'code';
			name = node.data.compute_type + '.ts';
		}}
	>
		<u>{$__('show_code')}</u>
	</button>
	{#if node.data.text}
		<button
			on:click={() => {
				co = node.data.text;
				openId = node.id;
				openType = 'code';
				name = node.data.compute_type + '.ts';
			}}
		>
			<u>{$__('show_code')}</u>
		</button>
	{/if}
	{#if node.data.prompt}
		<button
			on:click={() => {
				co = node.data.prompt;
				openId = node.id;
				openType = 'prompt';
				name = node.id + ' prompt';
			}}
		>
			<u>{$__('show_prompt')}</u>
		</button>
	{/if}

	{#if open}
		<div style="width: 100%; height: 100%; background-color: #282c34;">
			<CodeMirror
				bind:value={co}
				theme={oneDark}
				lang={name.includes('.ts') ? javascript() : ''}
				style="min-width: 100px; min-height: 100px; height: 100%; width: 100%;"
				options={{ autoresize: true, lineWrapping: true }}
			/>
		</div>
	{/if}

	<style>
		:global(.CodeMirror) {
			border: 1px solid #eee;
			height: 100%;
		}
		:global(.CodeMirror-scroll) {
			overflow: hidden;
		}
	</style>
</div>
