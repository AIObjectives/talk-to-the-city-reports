<script lang="ts">
	import MenuIcon from '$lib/icons/Menu.svelte';
	import { globalViewMode } from '$lib/store';
	export let showDropdown: boolean;
	$: isStandard = $globalViewMode == 'standard';
</script>

<button
	on:click|stopPropagation={() => (showDropdown = !showDropdown)}
	class="focus:outline-none burger"
	style="padding-top: 4px"
>
	<MenuIcon size="30px" color={isStandard ? '#dedede' : '#000000'} />
</button>

<svelte:window
	on:click={() => {
		showDropdown = false;
	}}
/>

<style>
	.burger {
		z-index: 100000;
	}
</style>
