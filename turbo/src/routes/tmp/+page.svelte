<script lang="ts">
	import TextField from '@smui/textfield';

	let computeType: string = '';
</script>

<div class="flex justify-center px-4 mt-8">
	<div class="max-w-xl w-full my-3">
		<h1 class="text-left">Node finder</h1>
		<p class="text-left">This is an admin page that finds nodes by compute_type.</p>
		<TextField label="Compute type" bind:value={computeType} />
	</div>
</div>
