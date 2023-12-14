<script>
	import { onMount } from 'svelte';

	let pythonCode = '';
	let dataToPass = {
		foo: 'bar'
	};

	const runPython = () => {
		if (typeof window !== 'undefined') {
			window.dataToPass = dataToPass;
			const script = document.createElement('script');
			script.type = 'text/python';
			script.text = `
				import sys
				print(sys.argv)
                ${pythonCode}
            `;
			document.body.appendChild(script);
			__BRYTHON__.use_VFS = false;
			brython();
		}
	};

	onMount(() => {
		const script = document.createElement('script');
		script.src = 'https://cdnjs.cloudflare.com/ajax/libs/brython/3.8.8/brython.min.js';
		document.body.appendChild(script);

		script.onload = () => {
			brython();
		};
	});
</script>

<textarea bind:value={pythonCode} />
<button on:click={runPython}>Run Python Code</button>
