<script>
	import Header from './Header.svelte';
	import './styles.css';
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import { onMount } from 'svelte';
	import { onAuthStateChanged } from 'firebase/auth';
	import { user } from '$lib/store';
	import { auth } from '$lib/firebase';
	import '/src/app.css';
	import { _ } from 'svelte-i18n';
	import Cookies from 'js-cookie';

	onMount(() => {
		onAuthStateChanged(auth, (firebaseUser) => {
			$user = firebaseUser;
			firebaseUser.getIdToken().then((token) => {
				Cookies.set('token', token);
			});
		});
	});
</script>

<div class="app">
	<SvelteToast />
	<Header />

	<main>
		<slot />
	</main>

	<footer>
		{$_('developed_by')} <a href="https://objective.is">AI Objectives Institute</a>
		{#if $user}
			{$_('logged_in_as')} {$user.displayName}
		{/if}
	</footer>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		padding: 1rem;
		max-width: 100%;
		flex: 1;
		display: flex;
		flex-direction: column;
		width: 100%;
		margin: 0 auto;
		box-sizing: border-box;
	}

	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 12px;
	}

	footer a {
		font-weight: bold;
	}

	@media (min-width: 480px) {
		footer {
			padding: 12px 0;
		}
	}
</style>
