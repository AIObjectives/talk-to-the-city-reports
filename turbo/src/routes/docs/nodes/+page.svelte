<script lang='ts'>
	import Accordion, { Panel, Header, Content } from '@smui-extra/accordion';
	import Doc from '$components/Doc.svelte';
	import register from '$lib/node_register'
	import { onMount } from 'svelte';
	import Cookies from 'js-cookie';
	import { _ as __ } from 'svelte-i18n';
	const defaultLocale = Cookies.get('locale') || 'en';

	let docs = [];

	onMount(async () => {
		docs = await register.getAllDocs();
	});
</script>

<style>
	.header-content {
		display: flex;
		align-items: center;
		gap: 10px;
	}
</style>

<div style="display: flex; justify-content: center;" class="mt-10">
	<Accordion style="width: 100%; max-width: 800px; margin: auto;">
		{#each docs as doc}
			<Panel>
				<Header>
					<div class="header-content">
						<img src={`/${doc.icon}.png`} width={"20px"}>
						<span>{doc.compute_type}</span>
					</div>
				</Header>
				<Content>
					<Doc helps={{[defaultLocale]: doc.docs}} >
						<h3 slot="title">{$__('reference')}:</h3>
					</Doc>
					<br />
					<Doc helps={{[defaultLocale]: doc.inlineDocs}} >
						<h3 slot="title">{$__('user_docs')}:<br/><br/></h3>
					</Doc>
				</Content>
			</Panel>
		{/each}
	</Accordion>
</div>
