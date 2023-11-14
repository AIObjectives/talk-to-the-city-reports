<script lang="ts">
	import { onMount } from 'svelte';
	import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';

	let auth;
	let user;
	let error;

	onMount(() => {
		auth = getAuth();
		onAuthStateChanged(auth, (firebaseUser) => {
			if (firebaseUser) {
				user = firebaseUser;
			} else {
				user = null;
			}
		});
	});

	async function signInWithGoogle() {
		try {
			const provider = new GoogleAuthProvider();
			provider.addScope('profile');
			provider.addScope('email');
			const result = await signInWithPopup(auth, provider);
			const credential = GoogleAuthProvider.credentialFromResult(result);
			const token = credential.accessToken;
		} catch (e) {
			error = e;
		}
	}
</script>

{#if !user}
	<button on:click={signInWithGoogle}>Sign in with Google</button>
{/if}

{#if error}
	<p style="color: red;">Error: {error.message}</p>
{/if}
