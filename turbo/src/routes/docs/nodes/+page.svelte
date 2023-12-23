<script>
	import Accordion, { Panel, Header, Content } from '@smui-extra/accordion';
	import Doc from '$components/Doc.svelte';
	import _ from 'lodash';
	import { docs } from '$lib/node_types';
</script>

<div style="display: flex; justify-content: center;" class="mt-10">
	<Accordion style="width: 100%; max-width: 800px; margin: auto;">
		{#each _.keys(docs).sort() as doc}
			<Panel>
				<Header>{doc}</Header>
				<Content>
					<Doc
						helps={{
							en: docs[doc].en,
							'zh-TW': docs[doc]['zh-TW']
						}}
					/>
				</Content>
			</Panel>
		{/each}
	</Accordion>
</div>
