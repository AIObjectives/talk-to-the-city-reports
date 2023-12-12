<script>
	import Header from './Header.svelte';
	import Footer from '$components/Footer.svelte';
	import './styles.css';
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import { onMount } from 'svelte';
	import { onAuthStateChanged } from 'firebase/auth';
	import { user } from '$lib/store';
	import { auth } from '$lib/firebase';
	import '/src/app.css';
	import { _ as __ } from 'svelte-i18n';
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

	<Footer />
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		max-width: 100%;
		flex: 1;
		display: flex;
		flex-direction: column;
		width: 100%;
		margin: 0 auto;
		box-sizing: border-box;
	}
</style>
