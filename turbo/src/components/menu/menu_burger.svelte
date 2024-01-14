<script lang="ts">
	import MenuIcon from '$lib/icons/Menu.svelte';
	export let showDropdown: boolean;
</script>

<button
	on:click|stopPropagation={() => (showDropdown = !showDropdown)}
	class="focus:outline-none burger"
>
	<MenuIcon size="30px" />
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
