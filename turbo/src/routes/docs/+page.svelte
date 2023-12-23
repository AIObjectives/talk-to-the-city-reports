<script>
	import Doc from '$components/Doc.svelte';
	import nodesen from './nodes-en.md?raw';
	import nodeszh_TW from './nodes-zh-TW.md?raw';
	import helpen from './docs-en.md?raw';
	import helpez from './docs-zh-TW.md?raw';
	import feedback_en from '$lib/docs/feedback-en.md?raw';
	import feedback_zh_TW from '$lib/docs/feedback-zh-TW.md?raw';
</script>

<Doc
	helps={{
		en: helpen,
		'zh-TW': helpez
	}}
/>

<Doc
	helps={{
		en: nodesen,
		'zh-TW': nodeszh_TW
	}}
/>

<Doc
	helps={{
		en: feedback_en,
		'zh-TW': feedback_zh_TW
	}}
/>
