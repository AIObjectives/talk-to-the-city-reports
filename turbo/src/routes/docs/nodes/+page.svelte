<script lang="ts">
  import Accordion, { Panel, Header, Content } from '@smui-extra/accordion';
  import Doc from '$components/Doc.svelte';
  import register from '$lib/node_register';
  import Cookies from 'js-cookie';
  import { _ as __ } from 'svelte-i18n';
  import { user } from '$lib/store';

  let locale = Cookies.get('locale') || 'en-US';

  let docs = [];
  $: isAdmin = $user?.uid === import.meta.env.VITE_ADMIN;

  $: locale,
    register
      .getAllDocs(locale)
      .then((resolvedDocs) => {
        docs = resolvedDocs.filter((doc) => (isAdmin ? true : doc?.category !== 'wip'));
      })
      .catch((error) => {
        console.error('Failed to get documents:', error);
      });
</script>

<div style="display: flex; justify-content: center;" class="mt-10">
  <Accordion style="width: 100%; max-width: 800px; margin: auto;">
    {#each docs as doc}
      <Panel>
        <Header>
          <div class="header-content">
            <img src={`/${doc.icon}.png`} width={'20px'} />
            <span>{doc.compute_type}</span>
          </div>
        </Header>
        <Content>
          <Doc helps={{ [locale]: doc.docs }}>
            <h3 slot="title">{$__('reference')}:</h3>
          </Doc>
          <br />
          <Doc helps={{ [locale]: doc.inlineDocs }}>
            <h3 slot="title">{$__('user_docs')}:<br /><br /></h3>
          </Doc>
        </Content>
      </Panel>
    {/each}
  </Accordion>
</div>

<style>
  .header-content {
    display: flex;
    align-items: center;
    gap: 10px;
  }
</style>
