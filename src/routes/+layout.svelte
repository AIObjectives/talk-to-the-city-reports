<script>
	import Header from './Header.svelte';
	import './styles.css';
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import { onMount } from 'svelte';
	import { onAuthStateChanged } from 'firebase/auth';
	import { user } from '$lib/store';
	import { auth } from '$lib/firebase';
	import '/src/app.css';

	onMount(() => {
		onAuthStateChanged(auth, (firebaseUser) => {
			$user = firebaseUser;
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
		Developed by <a href="https://objective.is">AI Objectives Institute</a>
		{#if $user}
			Logged in as {$user.displayName}
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
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 50rem;
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
