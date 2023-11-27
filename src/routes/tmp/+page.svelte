<script lang="ts">
	import jsonata from 'jsonata';

	const data = [
		{ id: 1, name: 'Alice', age: 30, isActive: true },
		{ id: 2, name: 'Bob', age: 25, isActive: false },
		{ id: 3, name: 'Charlie', age: 35, isActive: true },
		{ id: 4, name: 'David', age: 28, isActive: false },
		{ id: 5, name: 'Eve', age: 22, isActive: true }
	];

	import { onMount } from 'svelte';
	onMount(async (x) => {
		const expression = '$[isActive].name';
		const jsonataExpr = jsonata(expression);

		try {
			const result = await jsonataExpr.evaluate(data);
			console.log(result);
		} catch (e) {
			console.error('Error evaluating JSONata expression:', e);
		}
	});
</script>
