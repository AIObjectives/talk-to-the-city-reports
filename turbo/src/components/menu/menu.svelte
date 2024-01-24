<script lang="ts">
	import { page } from '$app/stores';
	import { _ as __ } from 'svelte-i18n';

	import { storeDataset } from '$lib/store';
	import { Dataset } from '$lib/dataset';

	import MenuItem from '$components/menu/menu_item.svelte';
	import BurgerMenu from '$components/menu/menu_burger.svelte';
	import ForkDialog from '$components/menu/fork_dialog.svelte';
	import ToggleView from '$components/menu/ToggleView.svelte';

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
		<BurgerMenu bind:showDropdown />
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
							modalShowing = true;
						}}
						label={$__('fork_report')}
					/>
					{#if $user.uid == adminUid}
						<MenuItem on:click={saveAsTemplateOnClick} label={$__('save_as_template')} />
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
