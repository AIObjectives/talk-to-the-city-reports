<script lang="ts">
  import TextField from '@smui/textfield';
  import Microphone from './Microphone.svelte';
  import { _ as __ } from 'svelte-i18n';

  export let key = '';
  export let data: object;
  export let messageInput = '';
  export let handleKeydown = () => {};
</script>

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
  >
    <span slot="trailingIcon">
      {#if data.speech_to_text}
        <Microphone {key} bind:messageInput {handleKeydown} />
      {/if}
    </span>
  </TextField>
</div>
