<script lang="ts">
  import { writable, get } from 'svelte/store';
  import { marked } from 'marked';
  import { type NodeProps } from '@xyflow/svelte';
  import TextField from '@smui/textfield';
  import DGNode from './DGNode.svelte';
  import nodes from '$lib/node_register';
  import _ from 'lodash';
  import { _ as __ } from 'svelte-i18n';
  import TrashCan from '$lib/icons/TrashCan.svelte';
  import DOMPurify from 'dompurify';
  import { getContext } from 'svelte';

  type $$Props = NodeProps;

  let messageInput = '';

  export let data: $$Props['data'];
  export let id: $$Props['id'];

  const messages = writable(data.messages);

  const dataset = getContext('dataset');

  async function sendMessage() {
    if (messageInput.trim()) {
      messages.update((currentMessages) => [
        ...currentMessages,
        { role: 'user', content: messageInput }
      ]);
      const node = get(dataset.graph.nodes).find((x) => x.id === id);
      const node_impl = nodes.init(data.compute_type, node);
      messageInput = '';
      const result = await node_impl.chat(get(messages), dataset);
      messages.set(result);
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      sendMessage();
    }
  }
</script>

<DGNode
  {data}
  {id}
  {...$$restProps}
  style="max-width: 800px; height: 100%; display: flex; flex-direction: column;"
>
  <div class="chat-container" style="display: flex; flex-direction: column; flex-grow: 1;">
    <button
      on:click={() => {
        const node = get(dataset.graph.nodes).find((x) => x.id === id);
        const node_impl = nodes.init(data.compute_type, node);
        node_impl.reset();
        messages.set(data.messages);
      }}><TrashCan color="#777" /></button
    >
    <div class="chat-body" style="flex-grow: 1; overflow-y: auto; padding: 8px;">
      {#if _.isArray($messages)}
        {#each _.takeRight($messages, $messages.length - 1) as message, index (index)}
          <div class="chat-message">
            {@html marked(DOMPurify.sanitize(message.content))}
          </div>
        {/each}
      {/if}
    </div>
    <div class="chat-input" style="padding: 8px;">
      <TextField
        bind:value={messageInput}
        on:keydown={handleKeydown}
        type="text"
        placeholder={$__('type_message')}
        style="width: 100%;"
        class="nodrag"
        helperLine$style="width: 100%;"
        textarea={false}
        rows={1}
      />
    </div>
  </div>
</DGNode>

<style>
  .chat-message {
    margin-bottom: 4px;
    padding: 6px;
    background-color: #f3f3f3;
    border-radius: 4px;
  }
  .chat-container {
    max-height: calc(100% - /*adjust this value if your chat input has a different height*/ 48px);
  }
</style>
