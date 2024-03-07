<script lang="ts">
  import { marked } from 'marked';
  import DOMPurify from 'dompurify';
  import Speaker from './Speaker.svelte';

  export let key: string = '';
  export let message: { role: string; content: string };
  export let data: object;

  let hovering = false;
</script>

<div
  class="chat-message {message.role + '-message'}"
  role="button"
  tabindex="0"
  on:mouseover={() => (hovering = true)}
  on:focus={() => (hovering = true)}
  on:mouseout={() => (hovering = false)}
  on:blur={() => (hovering = false)}
>
  {#if data.text_to_speech}
    <Speaker color={hovering ? '#777' : 'transparent'} {key} {message} {data} />
  {/if}
  {@html marked(DOMPurify.sanitize(message.content))}
</div>

<style>
  .chat-message {
    position: relative;
    margin-bottom: 10px;
    padding: 10px;
    border-radius: 5px;
  }

  .user-message {
    background-color: #eee;
  }

  .assistant-message {
    background-color: #eef;
  }
</style>
