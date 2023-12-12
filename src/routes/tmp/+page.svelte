<script lang="ts">
	import _ from 'lodash';
	import en from '$lib/i18n/en.json';
	import zhTW from '$lib/i18n/zh-TW.json';
	import Paper from '@smui/paper';
	import { marked } from 'marked';

	console.log('checking lang files');

	const languages = {
		en,
		'zh-TW': zhTW
	};

	const langKeys = _.keys(languages);
	let missing = [];
	let files = [];

	langKeys.forEach((lang, index) => {
		const baseLang = _.cloneDeep(languages[lang]);
		langKeys.forEach((compareLang, compareIndex) => {
			if (index !== compareIndex) {
				const missingKeys = _.difference(_.keys(languages[compareLang]), _.keys(baseLang));
				if (missingKeys.length > 0) {
					missing = [...missing, `Keys missing in ${lang}: ${missingKeys.join(', ')}`];
					missingKeys.forEach((key) => {
						baseLang[key] = '';
					});
				}
			}
		});
		files = [
			...files,
			{ lang, content: marked(`\`\`\`\n${JSON.stringify(baseLang, null, 2)}\n\`\`\``) }
		];
	});
</script>

<Paper class="m-5 p-5">
	<h3>Lang</h3>
	{#each missing as m}
		<p>{@html marked(m)}</p>
	{/each}
	{#each files as file}
		<h4>{file.lang}</h4>
		<pre>{@html file.content}</pre>
	{/each}
</Paper>
