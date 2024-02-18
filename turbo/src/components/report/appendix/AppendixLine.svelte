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
      if (openId == node.id && openType == 'code') {
        co = undefined;
        openId = '';
        openType = '';
        open = false;
        return;
      }
      co = code[node.data.compute_type];
      openId = node.id;
      openType = 'code';
      name = node.data.compute_type + '.ts';
    }}
  >
    <u>{openId == node.id && openType == 'code' ? $__('hide_code') : $__('show_code')}</u>
  </button>
  {#if node.data.text}
    <button
      on:click={() => {
        if (openId == node.id && openType == 'text') {
          co = undefined;
          openId = '';
          openType = '';
          open = false;
          return;
        }
        co = node.data.text;
        openId = node.id;
        openType = 'text';
        name = node.data.compute_type + '.ts';
      }}
    >
      <u>{openId == node.id && openType == 'text' ? $__('hide_code') : $__('show_code')}</u>
    </button>
  {/if}
  {#if node.data.prompt}
    <button
      on:click={() => {
        if (openId == node.id && openType == 'prompt') {
          co = undefined;
          openId = '';
          openType = '';
          open = false;
          return;
        }
        co = node.data.prompt;
        openId = node.id;
        openType = 'prompt';
        name = node.id + ' prompt';
      }}
    >
      <u>{openId == node.id && openType == 'prompt' ? $__('hide_prompt') : $__('show_prompt')}</u>
    </button>
  {/if}

  {#if open}
    <div style="width: 100%; height: 100%; background-color: #282c34;">
      <CodeMirror bind:value={co} theme={oneDark} lang={name.includes('.ts') ? javascript() : ''} />
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
