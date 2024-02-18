<script>
  import Doc from '$components/Doc.svelte';
  import ai_pipe_guide from './ai_pipe_guide.md?raw';
  import ai_pipe_guide_zh from './ai_pipe_guide-zh-TW.md?raw';
</script>

<Doc
  helps={{
    'en-US': ai_pipe_guide,
    'zh-TW': ai_pipe_guide_zh
  }}
/>
