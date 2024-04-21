<script lang="ts">
  import { get } from 'svelte/store';
  import { getContext } from 'svelte';

  import _ from 'lodash';
  import { _ as __ } from 'svelte-i18n';
  import { type NodeProps } from '@xyflow/svelte';
  import { messages } from '$lib/store';

  import CodeMirror from 'svelte-codemirror-editor';
  import { oneDark } from '@codemirror/theme-one-dark';
  import { javascript } from '@codemirror/lang-javascript';
  import { Collapse } from 'svelte-ux';

  import nodes from '$lib/node_register';
  import DGNode from '$components/graph/nodes/DGNode.svelte';
  import TrashCan from '$lib/icons/TrashCan.svelte';
  import ChatBubble from './ChatBubble.svelte';
  import ChatInput from './ChatInput.svelte';
  import type { Dataset } from '$lib/dataset';

  type $$Props = NodeProps;

  const dataset: Dataset = getContext('dataset') as Dataset;
  let messageInput = '';
  let node: any;
  let node_impl: any;
  let key = '';
  let noSystem = [];
  let display = [];

  $: {
    if (dataset) {
      node = get(dataset.graph.nodes).find((x) => x.id === id);
      node_impl = nodes.init(data.compute_type, node);
      key = node_impl.getKey(dataset);
      noSystem = _.filter($messages, (x) => x.role !== 'system');
      display = _.takeRight(noSystem, data.show_function_calls ? 12 : 6);
    }
  }

  export let data: $$Props['data'];
  export let id: $$Props['id'];

  async function sendMessage() {
    if (messageInput.trim()) {
      messages.update((x) => [...x, { role: 'user', content: messageInput }]);
      messageInput = '';
      const response = await node_impl.chat(get(messages), dataset);
      console.log('===============================');
      console.log(response);
      console.log('===============================');
      messages.set(response);
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      sendMessage();
      messageInput = '';
    }
  }
</script>

<DGNode
  bind:data
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
        data.messages = [];
        messages.set([]);
      }}><TrashCan color="#777" /></button
    >
    <div class="chat-body" style="flex-grow: 1; overflow-y: auto; padding: 8px;">
      {#each display as message, index (index)}
        {#if message.type == 'function_call' || message.type == 'function_response'}
          {#if data.show_function_calls}
            <Collapse name={$__(message.type)}>
              <CodeMirror bind:value={message.content} theme={oneDark} lang={javascript()} />
            </Collapse>
          {/if}
        {:else}
          <ChatBubble {message} {key} {data} />
        {/if}
      {/each}
    </div>
    <ChatInput {handleKeydown} bind:messageInput {key} {data} />
  </div></DGNode
>

<style>
  .chat-container {
    max-height: calc(100% - 48px);
  }
</style>
