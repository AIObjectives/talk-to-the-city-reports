<script lang="ts">
	import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
	import { user } from '$lib/store';
	import { goto } from '$app/navigation';
	import { auth } from '$lib/firebase';

	let error;

	async function signInWithGoogle() {
		try {
			const provider = new GoogleAuthProvider();
			provider.addScope('profile');
			provider.addScope('email');
			const result = await signInWithPopup(auth, provider);
			const credential = GoogleAuthProvider.credentialFromResult(result);
			const token = credential.accessToken;
			await goto('/');
		} catch (e) {
			error = e;
		}
	}
</script>

{#if !$user}
	<button on:click={signInWithGoogle}>Sign in with Google</button>
{/if}

{#if error}
	<p style="color: red;">Error: {error.message}</p>
{/if}
