<script>
	import { _ } from 'svelte-i18n';
</script>

<svelte:head>
	<title>{$_('about')}</title>
	<meta name="description" content="About this app" />
</svelte:head>

<div class="text-column">
	<h1>
		{@html $_('about_section_p')}
	</h1>
	<p>
		{@html $_('about_section_h1')}
	</p>
</div>
