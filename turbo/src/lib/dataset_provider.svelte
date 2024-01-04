<script>
	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';
	const dataset = writable(null);
	setContext('dataset', dataset);
</script>

<slot />
