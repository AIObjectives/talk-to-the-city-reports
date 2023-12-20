<script>
	import Doc from '$components/Doc.svelte';
	import helpen from './docs-en.md?raw';
	import helpez from './docs-zh-TW.md?raw';
</script>

<Doc
	helps={{
		en: helpen,
		'zh-TW': helpez
	}}
/>
