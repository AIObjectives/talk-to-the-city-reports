<script lang="ts">
  import { user } from '$lib/store';
  import Pipeline from '$components/Pipeline.svelte';
  import { marked } from 'marked';
  import { Dataset } from '$lib/dataset';
  import nodesRegister from '$lib/node_register';
</script>

<img
  alt="whisper"
  src="https://talktothecity.s3.amazonaws.com/tttc-turbo/static/images/whisper2.jpeg"
  style="width: 100%; max-width: 800px; margin-left: auto; margin-right: auto; margin-top: 20px; margin-bottom: 20px;"
/>

<p class="docs marked mx-auto max-w-screen-md">
  {@html marked(`
# Introducing audio + whisper nodes

We are happy to announce the arrival of the audio and whisper nodes. The simplest complete use case is transcription as text. In this functional documentation, we invite you to:

- paste your OpenAI API key
- upload an mp3
- click *generate report*

`)}
</p>

{#if $user}
  <Pipeline
    dataset={new Dataset(
      'title',
      '/test',
      $user?.uid,
      'template',
      'description',
      {
        nodes: [
          nodesRegister.init_new('open_ai_key_v0'),
          nodesRegister.init_new('audio_v0'),
          nodesRegister.init_new('whisper_v0', {
            input_ids: { audio: 'audio', open_ai_key: 'open_ai_key' },
            response_format: 'text'
          }),
          nodesRegister.init_new('markdown_v0', { input_ids: { markdown: 'whisper' } })
        ],
        edges: [
          { source: 'audio', target: 'whisper', id: 'audio-whisper' },
          { source: 'whisper', target: 'markdown', id: 'whisper-markdown' },
          { source: 'open_ai_key', target: 'whisper', id: 'open_ai_key-whisper' }
        ]
      },
      'id'
    )}
    showNodesToolbar={false}
    height="50vh"
    width="50%"
    viewMode="standard"
    showSaveButton={false}
  />
{/if}

<p class="docs marked mx-auto max-w-screen-md">
  {@html marked(`

# Chatting with an audio file

As always, the whisper node plugs into other existing nodes. So for example, it's easy to connect its output into the chat node, and chat with the audio file.

- paste your OpenAI API key
- upload an mp3
- click *generate report*
- ask the chat to summarize the contents

`)}
</p>

{#if $user}
  <Pipeline
    dataset={new Dataset(
      'title',
      '/test',
      $user?.uid,
      'template',
      'description',
      {
        nodes: [
          nodesRegister.init_new('open_ai_key_v0'),
          nodesRegister.init_new('audio_v0'),
          nodesRegister.init_new('whisper_v0', {
            input_ids: { audio: 'audio', open_ai_key: 'open_ai_key' },
            response_format: 'text'
          }),
          nodesRegister.init_new('chat_v0', {
            input_ids: { data: 'whisper', open_ai_key: 'open_ai_key' }
          })
        ],
        edges: [
          { source: 'audio', target: 'whisper', id: 'audio-whisper' },
          { source: 'whisper', target: 'chat', id: 'whisper-chat' },
          { source: 'open_ai_key', target: 'whisper', id: 'open_ai_key-whisper' }
        ]
      },
      'id'
    )}
    showNodesToolbar={false}
    height="50vh"
    width="50%"
    viewMode="standard"
    showSaveButton={false}
  />
{/if}

<p class="docs marked mx-auto max-w-screen-md">
  {@html marked(`

# Integration with Video pipelines

It is worth noting that in the context of Talk to the City reports, the sole purpose of the Whisper node is extracting exact transcripts + timestamps for Video report generation. When the \`response_format\` is set to \`custom\`, you can enter the interviewee name, as well as the vimeo link. The whisper node then outputs CSV data that can be used directly for cluster / argument extraction and report generation.

We invite you to:

- paste your OpenAI API key
- upload an mp3
- enter the interviewee name
- enter the vimeo link
- click *generate report*

Your CSV data is now ready for report generation.

`)}
</p>

{#if $user}
  <Pipeline
    dataset={new Dataset(
      'title',
      '/test',
      $user?.uid,
      'template',
      'description',
      {
        nodes: [
          nodesRegister.init_new('open_ai_key_v0'),
          nodesRegister.init_new('audio_v0'),
          nodesRegister.init_new('whisper_v0', {
            input_ids: { audio: 'audio', open_ai_key: 'open_ai_key' },
            response_format: 'custom',
            interview: 'Alice',
            video: 'https://vimeo.com/123456789'
          }),
          nodesRegister.init_new('grid_v0', { show_in_ui: true })
        ],
        edges: [
          { source: 'audio', target: 'whisper', id: 'audio-whisper' },
          { source: 'whisper', target: 'grid', id: 'whisper-grid' },
          { source: 'open_ai_key', target: 'whisper', id: 'open_ai_key-whisper' }
        ]
      },
      'id'
    )}
    showNodesToolbar={false}
    height="50vh"
    width="50%"
    viewMode="standard"
    showSaveButton={false}
  />
{/if}

<style>
  :global(.marked p) {
    @apply mx-auto max-w-screen-md py-2;
  }
  h1 {
    @apply mx-auto max-w-screen-md py-2;
  }
</style>
