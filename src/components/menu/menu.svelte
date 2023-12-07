<script lang="ts">
	import { page } from '$app/stores';
	import BurgerMenu from './menu_burger.svelte';
	import ForkDialog from './fork_dialog.svelte';
	import MenuItem from './menu_item.svelte';

	let showDropdown: boolean = false;
	let modalShowing: boolean = false;
	export let user;
</script>

<ForkDialog bind:modalShowing bind:showDropdown />

{#if $user && $user.uid}
	<BurgerMenu bind:showDropdown />
	{#if showDropdown}
		<div
			class="menu-items-container border border-gray-800 absolute right-4 top-12 flex flex-col bg-gray-200 text-gray-900 py-2 rounded shadow-lg z-10"
		>
			{#if $page.route.id && $page.route.id.startsWith('/report/') && $user.uid}
				<MenuItem
					on:click={(e) => {
						modalShowing = true;
					}}
					label={'Fork report'}
				/>
			{/if}
		</div>
	{/if}
{/if}
