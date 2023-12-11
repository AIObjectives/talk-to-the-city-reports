<script lang="ts">
	import workerpool from 'workerpool';
	const pool = workerpool.pool();
	function add(a, b) {
		return a + b;
	}
	pool
		.exec(add, [3, 4])
		.then(function (result) {
			console.log('result', result);
		})
		.catch(function (err) {
			console.error(err);
		})
		.then(function () {
			pool.terminate();
		});
</script>
