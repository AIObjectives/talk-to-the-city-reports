<script>
  import { _ as __ } from 'svelte-i18n';
</script>

<svelte:head>
  <title>{$__('about')}</title>
  <meta name="description" content="About this app" />
</svelte:head>

<div class="text-column">
  <h3>
    {@html $__('about_section_h1')}
  </h3>
  <br />
  <p>
    {@html $__('about_section_p')}
  </p>

  <br />
  <br />
  <br />
  <a href="/docs">{$__('documentation')}</a>
  <br />
  <br />
  <a href="/api-docs">{$__('api_documentation')}</a>
</div>
