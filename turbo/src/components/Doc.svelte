<script>
  import { browser } from '$app/environment';
  import { oneDark } from '@codemirror/theme-one-dark';
  import { _ as __ } from 'svelte-i18n';
  import { marked } from 'marked';
  import CodeMirror from 'svelte-codemirror-editor';
  import { python } from '@codemirror/lang-python';
  import { locale } from 'svelte-i18n';

  export let helps = {};

  $: help = helps[$locale || 'en-US'] || helps['en-US'];
  $: helpText = help?.replace(/<token>/g);

  const renderer = new marked.Renderer();
  renderer.code = (code, language) => {
    return `<div class="code-editor" data-code="${encodeURIComponent(
      code
    )}" data-language="${language}"></div>`;
  };

  $: markedContent = helpText ? marked(helpText, { renderer }) : null;
  $: {
    if (markedContent && browser) {
      setTimeout(() => {
        document.querySelectorAll('.code-editor').forEach((el) => {
          const codeContent = decodeURIComponent(el.getAttribute('data-code'));
          const cm = new CodeMirror({
            target: el,
            props: {
              value: codeContent,
              theme: oneDark,
              lang: python(),
              options: { autoresize: true, lineWrapping: true }
            }
          });
          cm.root?.classList.add('custom-margin');
        });
      }, 100);
    }
  }
</script>

{#if markedContent}
  <slot name="title" />
  <div class="text-column docs">
    {@html markedContent}
  </div>
{/if}

<style>
  .custom-margin {
    margin-top: 0 !important;
    margin-bottom: 0 !important;
  }
</style>
