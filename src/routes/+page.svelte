<script>
	import Button from '@smui/button';
	import { user } from '$lib/store';
	import Projects from '$components/Projects.svelte';
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<h1 class="text-3xl pt-10 pb-10">Talk to the City Turbo</h1>

	{#if $user}
		<Projects />
		<Button href="/report/new" class="mt-10">New report</Button>
	{:else}
		Please sign in to create a new report.
	{/if}
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-top: 0px;
		padding-top: 0px;
	}

	h1 {
		width: 100%;
	}
</style>
