<script>
  import Doc from '$components/Doc.svelte';
  import nodesen from './nodes-en-US.md?raw';
  import nodeszh_TW from './nodes-zh-TW.md?raw';
  import nodesja_JP from './nodes-ja-JP.md?raw';
  import helpen from './docs-en-US.md?raw';
  import helpez from './docs-zh-TW.md?raw';
  import helpja from './docs-ja-JP.md?raw';
  import feedback_en from '$lib/docs/feedback-en-US.md?raw';
  import feedback_zh_TW from '$lib/docs/feedback-zh-TW.md?raw';
  import feedback_ja_JP from '$lib/docs/feedback-ja-JP.md?raw';
</script>

<Doc
  helps={{
    'en-US': helpen,
    'zh-TW': helpez,
    'ja-JP': helpja
  }}
/>

<Doc
  helps={{
    'en-US': nodesen,
    'zh-TW': nodeszh_TW,
    'ja-JP': nodesja_JP
  }}
/>

<Doc
  helps={{
    'en-US': feedback_en,
    'zh-TW': feedback_zh_TW,
    'ja-JP': feedback_ja_JP
  }}
/>
