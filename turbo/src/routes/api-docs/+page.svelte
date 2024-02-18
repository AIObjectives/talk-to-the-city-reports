<script>
  import { browser } from '$app/environment';
  import { oneDark } from '@codemirror/theme-one-dark';
  import { _ as __ } from 'svelte-i18n';
  import { marked } from 'marked';
  import Cookies from 'js-cookie';
  import CodeMirror from 'svelte-codemirror-editor';
  import { locale } from 'svelte-i18n';
  import { python } from '@codemirror/lang-python';
  import helpen from './help-en-US.txt?raw';
  import helpzh from './help-zh-TW.txt?raw';

  const helps = {
    'en-US': helpen,
    'zh-TW': helpzh
  };

  $: help = helps[$locale || 'en-US'] || helps['en-US'];
  $: userToken = Cookies.get('user_token');
  $: helpText = userToken ? help?.replace(/<token>/g, userToken) : null;

  let markedContent;

  const renderer = new marked.Renderer();
  renderer.code = (code, language) => {
    return `<div class="code-editor" data-code="${encodeURIComponent(
      code
    )}" data-language="${language}"></div>`;
  };

  $: markedContent = helpText ? marked(helpText, { renderer }) : null;
  $: {
    if (markedContent && browser && userToken) {
      setTimeout(() => {
        document.querySelectorAll('.code-editor').forEach((el) => {
          const codeContent = decodeURIComponent(el.getAttribute('data-code'));
          new CodeMirror({
            target: el,
            props: {
              value: codeContent,
              theme: oneDark,
              lang: python(),
              options: { autoresize: true, lineWrapping: true }
            }
          });
        });
      }, 100);
    }
  }
</script>

{#if userToken}
  {#if markedContent}
    <div class="text-column api-docs">
      <br />
      <br />
      {@html markedContent}
    </div>
  {/if}
{:else}
  <div style="display: flex; justify-content: center; align-items: center; height: 100vh;">
    {$__('sign_in_to_continue')}
  </div>
{/if}
