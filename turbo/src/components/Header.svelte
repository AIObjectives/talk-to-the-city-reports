<script lang="ts">
  import { page } from '$app/stores';

  import { _ as __ } from 'svelte-i18n';
  import _ from 'lodash';

  import '$lib/i18n';
  import { user, isMobile, openLeftDrawer } from '$lib/store';
  import { globalViewMode } from '$lib/store';
  import github from '$lib/images/github.svg';

  import LeftBurger from '$components/LeftBurger.svelte';
  import RightMenu from '$components/rightMenu/menu.svelte';
  import LanguageSelector from '$components/LanguageSelector.svelte';

  $: isReport = $page?.route?.id?.startsWith('/report/[report]');
  $: isStandard = $globalViewMode == 'standard';
  $: showHeader = (isReport && isStandard) || !isReport;
</script>

<div class="right-stack">
  <RightMenu {user} />
  {#if isStandard}
    {#if !$user}
      <span class="link">
        <a href="/login" style="padding-right: 5px; padding-top: 7px; padding-bottom: 5px;"
          >{$__('sign_in')}</a
        >
      </span>
    {/if}
    <LanguageSelector />
    {#if !$isMobile}
      <a
        href="https://github.com/AIObjectives/talk-to-the-city-reports"
        target="_blank"
        class="mr-6"
      >
        <img src={github} alt="GitHub" class="github" />
      </a>
    {/if}
  {/if}
</div>

{#if showHeader}
  <header>
    <LeftBurger />
    {#if $openLeftDrawer}
      <nav class="link mobile-nav">
        <ul>
          <li aria-current={$page.url.pathname === '/' ? 'page' : undefined}>
            <a href="/">{$__('home')} </a>
          </li>
          <li aria-current={$page.url.pathname === '/about' ? 'page' : undefined}>
            <a href="/about">{$__('about')}</a>
          </li>
        </ul>
      </nav>
    {:else}
      <div class="corner title"><a href="/">Talk to the City</a></div>
    {/if}
    <nav class="link nav">
      <ul>
        {#if !$isMobile}
          <li aria-current={$page.url.pathname === '/' ? 'page' : undefined}>
            <a href="/">{$__('home')} </a>
          </li>
          <li aria-current={$page.url.pathname === '/about' ? 'page' : undefined}>
            <a href="/about">{$__('about')}</a>
          </li>
        {/if}
      </ul>
    </nav>
    <div class="corner" />
  </header>
{/if}

<style>
  header {
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 10;
    display: flex;
    align-items: center;
    background: #2e4387;
    padding: 0 1rem;
    box-sizing: border-box;
  }
  .right-stack {
    position: fixed;
    right: 16px;
    top: 5px;
    z-index: 11;
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
  }
  .github {
    width: 30px;
    left: 5px;
  }

  .nav {
    padding-left: 5rem;
    display: flex;
    justify-content: flex-start;
  }

  .mobile-nav {
    padding-left: 2rem;
    display: flex;
    justify-content: flex-start;
  }

  ul {
    position: relative;
    padding: 0;
    list-style: none;
    height: 3em;
    display: flex;
    align-items: center;
    margin: 0;
    background: inherit;
  }

  li {
    position: relative;
    height: 60%;
  }

  li[aria-current='page']::before {
    --size: 6px;
    content: '';
    width: 0;
    height: 0;
    position: absolute;
    top: 0;
    left: calc(50% - var(--size));
    border: var(--size) solid transparent;
    border-top: var(--size) solid var(--smui-primary);
  }

  .title a {
    display: flex;
    height: 100%;
    align-items: center;
    padding: 0 0.5rem;
    color: #dedede;
    font-weight: 500;
    font-size: 1.1rem;
    letter-spacing: 0.1em;
    text-decoration: none;
    transition: color 0.2s linear;
  }

  .link a {
    display: flex;
    height: 100%;
    align-items: center;
    padding: 0 0.5rem;
    color: #dedede;
    font-weight: 700;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    text-decoration: none;
    transition: color 0.2s linear;
  }

  a:hover {
    background-color: rgba(var(--smui-surface-rgb), 0.1);
  }

  .github {
    width: 26px;
  }
</style>
