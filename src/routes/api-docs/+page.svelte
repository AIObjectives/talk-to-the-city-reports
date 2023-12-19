<script>
	import { browser } from '$app/environment';
	import { oneDark } from '@codemirror/theme-one-dark';
	import { _ as __ } from 'svelte-i18n';
	import { marked } from 'marked';
	import Cookies from 'js-cookie';
	import CodeMirror from 'svelte-codemirror-editor';
	import { python } from '@codemirror/lang-python';
	import helpen from './help-en.txt?raw';
	import helpzh from './help-zh-TW.txt?raw';

	const helps = {
		en: helpen,
		'zh-TW': helpzh
	};

	const defaultLocale = Cookies.get('locale') || 'en';
	$: userToken = Cookies.get('user_token');
	$: helpText = userToken ? helps[defaultLocale].replace(/<token>/g, userToken) : null;

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

{#if markedContent}
	<div class="text-column api-docs">
		<br />
		<br />
		{@html markedContent}
	</div>
{/if}
