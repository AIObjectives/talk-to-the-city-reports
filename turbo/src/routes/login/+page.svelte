<script lang="ts">
  import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
  import { user } from '$lib/store';
  import { goto } from '$app/navigation';
  import { auth } from '$lib/firebase';
  import { _ as __ } from 'svelte-i18n';

  let error;

  async function signInWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      await signInWithPopup(auth, provider);
      await goto('/');
    } catch (e) {
      error = e;
    }
  }
</script>

{#if !$user}
  <button class="mt-10" on:click={signInWithGoogle}>{$__('sign_in_with_google')}</button>
{/if}

{#if error}
  <p style="color: red;">Error: {error.message}</p>
{/if}
