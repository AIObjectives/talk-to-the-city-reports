<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { languages } from '$lib/i18n';
  import { locale } from 'svelte-i18n';
  import Cookies from 'js-cookie';
  import { browser } from '$app/environment';
  import MenuDown from '$lib/icons/MenuDown.svelte';

  let isOpen = false;
  let selectedLanguage = '';
  let dropdown: HTMLElement;

  function changeLanguage(lang: string) {
    locale.set(lang);
    Cookies.set('locale', lang);
    selectedLanguage = languages[lang];
    isOpen = false;
  }

  function handleClickOutside(event: MouseEvent) {
    if (dropdown && !dropdown.contains(event.target as Node)) {
      isOpen = false;
    }
  }

  onMount(() => {
    selectedLanguage = languages[$locale];

    if (browser) {
      window.addEventListener('click', handleClickOutside);
    }
  });

  onDestroy(() => {
    if (browser) {
      window.removeEventListener('click', handleClickOutside);
    }
  });
</script>

<div class="lang-container" bind:this={dropdown}>
  <div class="select-container">
    <button class="select-button" on:click={() => (isOpen = !isOpen)}>
      <span class="flag">{selectedLanguage}</span>
      <MenuDown color="white" />
    </button>
    {#if isOpen}
      <ul class="select-dropdown">
        {#each Object.keys(languages) as lang}
          <li>
            <button class="dropdown-item" on:click={() => changeLanguage(lang)}>
              {languages[lang]}
            </button>
          </li>
        {/each}
      </ul>
    {/if}
  </div>
</div>

<style>
  .flag {
    position: relative;
    top: 3px;
    font-size: 1.4em;
  }

  .lang-container {
    padding-right: 16px;
  }

  .lang-container .select-container {
    position: relative;
    width: 45px;
  }

  .select-button {
    width: 100%;
    height: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: none;
    background: transparent;
    color: white;
    cursor: pointer;
  }

  .select-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background-color: white;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li .dropdown-item {
    width: 100%;
    padding: 5px;
    text-align: left;
    border: none;
    background: transparent;
    cursor: pointer;
  }
</style>
