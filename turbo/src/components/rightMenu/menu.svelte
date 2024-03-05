<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { _ as __ } from 'svelte-i18n';

  import { signOut } from 'firebase/auth';
  import { auth } from '$lib/firebase';
  import { storeDataset } from '$lib/store';
  import { Dataset } from '$lib/dataset';

  import MenuItem from '$components/rightMenu/menu_item.svelte';
  import MenuVerticalDots from '$components/rightMenu/MenuVerticalDots.svelte';
  import ForkDialog from '$components/rightMenu/fork_dialog.svelte';
  import ToggleView from '$components/rightMenu/ToggleView.svelte';
  import ToggleChart from '$components/rightMenu/ToggleChart.svelte';

  let showDropdown: boolean = false;
  let modalShowing: boolean = false;
  let adminUid = import.meta.env.VITE_ADMIN;

  $: reportPath = $page.route.id?.startsWith('/report/');
  $: anyPath = reportPath;

  export let user;

  function saveAsTemplateOnClick() {
    const name = prompt($__('enter_name_of_template'));
    ($storeDataset as Dataset).saveAsTemplate(name);
  }
</script>

<ForkDialog bind:modalShowing bind:showDropdown />

{#if $user && $user.uid}
  {#if anyPath}
    <MenuVerticalDots bind:showDropdown />
    {#if showDropdown}
      <div
        class="menu-items-container border border-gray-800 absolute right-4 top-12 flex flex-col bg-gray-200 text-gray-900 py-2 rounded shadow-lg z-10"
        style="min-width: 150px;"
      >
        {#if reportPath}
          <ToggleView />
          <hr />
          <MenuItem
            on:click={(e) => {
              goto('/profile');
            }}
            label={$__('profile')}
          />
          <MenuItem
            on:click={(e) => {
              modalShowing = true;
            }}
            label={$__('fork_report')}
          />
          {#if $user.uid == adminUid}
            <MenuItem on:click={saveAsTemplateOnClick} label={$__('save_as_template')} />
          {/if}
          {#if $user.uid}
            <MenuItem
              on:click={async () => {
                await signOut(auth);
              }}
              label={$__('sign_out')}
            />
          {/if}
          <ToggleChart />
        {/if}
      </div>
    {/if}
  {/if}
{/if}

<style>
  hr {
    border: 0;
    border-top: 1px solid #ccc;
    margin: 0;
  }
</style>
