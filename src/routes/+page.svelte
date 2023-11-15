<script>
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
		<a
			href="/report/new"
			class="mt-10 w-64 bg-blue-300 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded text-center"
		>
			New report
		</a>
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
