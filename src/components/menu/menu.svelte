<script lang="ts">
	import { page } from '$app/stores';
	import BurgerMenu from './menu_burger.svelte';
	import ForkDialog from './fork_dialog.svelte';
	import MenuItem from './menu_item.svelte';
	import { dataset } from '$lib/store';
	import ToggleView from '$components/ToggleView.svelte';

	let showDropdown: boolean = false;
	let modalShowing: boolean = false;
	$: reportPath = $page.route.id?.startsWith('/report/');
	$: anyPath = reportPath;
	export let user;
</script>

<ForkDialog bind:modalShowing bind:showDropdown />

{#if $user && $user.uid}
	{#if anyPath}
		<BurgerMenu bind:showDropdown />
		{#if showDropdown}
			<div
				class="menu-items-container border border-gray-800 absolute right-4 top-12 flex flex-col bg-gray-200 text-gray-900 py-2 rounded shadow-lg z-10"
			>
				{#if reportPath}
					<ToggleView />
					<hr />

					<MenuItem
						on:click={(e) => {
							modalShowing = true;
						}}
						label={'Fork report'}
					/>
					{#if $user.uid == 'H6U6UUpCtqb5pRvRc9BalA5eNWP2'}
						<MenuItem
							on:click={(e) => {
								const name = prompt('Enter name of template');
								$dataset.saveAsTemplate(name);
							}}
							label={'Save as template'}
						/>
					{/if}
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
