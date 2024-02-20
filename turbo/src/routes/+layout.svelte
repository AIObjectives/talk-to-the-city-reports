<script lang="ts">
  import { onMount } from 'svelte';
  import { onAuthStateChanged } from 'firebase/auth';
  import { user } from '$lib/store';
  import { auth } from '$lib/firebase';
  import '$lib/node_types';
  import { _ as __ } from 'svelte-i18n';
  import Cookies from 'js-cookie';
  import { KJUR } from 'jsrsasign';
  import { SvelteToast } from '@zerodevx/svelte-toast';
  import { isMobile } from '$lib/store';

  import '/src/app.css';
  import './styles.css';

  import Header from '$components/Header.svelte';
  import Footer from '$components/Footer.svelte';

  import { globalViewMode } from '$lib/store';

  let innerWidth: number;
  $: $isMobile = innerWidth < 768;
  $: isStandard = $globalViewMode == 'standard';

  export const generateJWT = (payload, secretKey) => {
    const header = { alg: 'HS256', typ: 'JWT' };
    const sHeader = JSON.stringify(header);
    const sPayload = JSON.stringify(payload);
    const sJWT = KJUR.jws.JWS.sign('HS256', sHeader, sPayload, secretKey);
    return sJWT;
  };

  onMount(() => {
    onAuthStateChanged(auth, (firebaseUser) => {
      $user = firebaseUser;
      if (firebaseUser)
        firebaseUser.getIdToken().then((token) => {
          if (!Cookies.get('user_token')) {
            const userToken = generateJWT($user.uid, import.meta.env.VITE_APP_API_KEY);
            Cookies.set('user_token', userToken);
          }
        });
    });
  });
</script>

<svelte:window bind:innerWidth />

<div class="app">
  <SvelteToast />
  <Header />

  <main style={isStandard ? 'padding-top: 45px;' : ''}>
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
