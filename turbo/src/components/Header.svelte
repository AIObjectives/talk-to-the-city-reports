<script lang="ts">
	import { page } from '$app/stores';

	import { _ as __ } from 'svelte-i18n';
	import _ from 'lodash';

	import '$lib/i18n';
	import { user } from '$lib/store';
	import { globalViewMode } from '$lib/store';
	import github from '$lib/images/github.svg';

	import Menu from '$components/menu/menu.svelte';
	import LanguageSelector from '$components/LanguageSelector.svelte';

	$: isReport = $page?.route?.id?.startsWith('/report/[report]');
	$: isStandard = $globalViewMode == 'standard';
	$: showMenu = (isReport && isStandard) || !isReport;
</script>

<div class="right-stack">
	<Menu {user} />
	{#if isStandard}
		<LanguageSelector />
	{/if}
</div>

{#if showMenu}
	<a href="https://github.com/AIObjectives/talk-to-the-city-reports" target="_blank">
		<img src={github} alt="GitHub" class="github" />
	</a>
	<header>
		<div class="corner" />

		<nav>
			<svg viewBox="0 0 2 3" aria-hidden="true">
				<path d="M0,0 L1,2 C1.5,3 1.5,3 2,3 L2,0 Z" />
			</svg>
			<ul>
				<li aria-current={$page.url.pathname === '/' ? 'page' : undefined}>
					<a href="/">{$__('home')} </a>
				</li>
				<li aria-current={$page.url.pathname === '/about' ? 'page' : undefined}>
					<a href="/about">{$__('about')}</a>
				</li>
				{#if !$user}
					<li aria-current={$page.url.pathname === '/login' ? 'page' : undefined}>
						<a href="/login">{$__('sign_in')}</a>
					</li>
				{/if}
			</ul>
			<svg viewBox="0 0 2 3" aria-hidden="true">
				<path d="M0,0 L0,3 C0.5,3 0.5,3 1,2 L2,0 Z" />
			</svg>
		</nav>
		<div class="corner" />
	</header>
{/if}

<style>
	header {
		display: flex;
		justify-content: space-between;
	}

	.right-stack {
		position: absolute;
		right: 0;
		top: 0;
		display: flex;
		flex-direction: row-reverse;
		align-items: flex-start;
	}

	.github {
		position: absolute;
		width: 30px;
		left: 5px;
		top: 5px;
	}

	.corner {
		width: 3em;
		height: 3em;
	}

	nav {
		display: flex;
		justify-content: center;
		--background: rgba(255, 255, 255, 0.7);
	}

	svg {
		width: 2em;
		height: 3em;
		display: block;
	}

	path {
		fill: var(--background);
	}

	ul {
		position: relative;
		padding: 0;
		margin: 0;
		height: 3em;
		display: flex;
		justify-content: center;
		align-items: center;
		list-style: none;
		background: var(--background);
		background-size: contain;
	}

	li {
		position: relative;
		height: 100%;
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
		border-top: var(--size) solid var(--color-theme-1);
	}

	nav a {
		display: flex;
		height: 100%;
		align-items: center;
		padding: 0 0.5rem;
		color: var(--color-text);
		font-weight: 700;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		text-decoration: none;
		transition: color 0.2s linear;
	}

	a:hover {
		color: var(--color-theme-1);
	}
</style>
