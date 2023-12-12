<script>
	import { _ as __ } from 'svelte-i18n';
</script>

<svelte:head>
	<title>{$__('about')}</title>
	<meta name="description" content="About this app" />
</svelte:head>

<div class="text-column">
	<h1>
		{@html $__('about_section_p')}
	</h1>
	<p>
		{@html $__('about_section_h1')}
	</p>

	<br />
	<br />
	<br />
	<a href="/help">{$__('api_documentation')}</a>
</div>
