<script>
	import { _ } from 'svelte-i18n';
	import { marked } from 'marked';
	import help from './help.txt?raw';
</script>

<svelte:head>
	<title>{$_('help')}</title>
	<meta name="description" content="Help using this app" />
</svelte:head>

<div class="text-column docs">{@html marked(help)}</div>
