<script>
	import { _ as __ } from 'svelte-i18n';
	import { marked } from 'marked';
	import help from './help.txt?raw';
	import Cookies from 'js-cookie';
</script>

<svelte:head>
	<title>{$__('help')}</title>
	<meta name="description" content="Help using this app" />
</svelte:head>

<div class="text-column docs">
	<!-- <button on:click={() => navigator.clipboard.writeText(Cookies.get('token'))}
		>Copy user token</button
	> -->

	{@html marked(help)}
</div>
