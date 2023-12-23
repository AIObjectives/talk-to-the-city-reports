<script lang="ts">
	export let showDropdown: boolean;
	import MenuIcon from '$lib/icons/Menu.svelte';
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
		position: absolute;
		right: 5px;
		top: 5px;
		z-index: 100000;
	}
</style>
