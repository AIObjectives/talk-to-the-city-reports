<script lang="ts">
  import { _ as __ } from 'svelte-i18n';
  import { user } from '$lib/store';
  import { z } from 'zod';
  import { TextField, Button, SelectField } from 'svelte-ux';
  import { keysCollection } from '$lib/firebase';
  import { query, where, getDocs, addDoc, doc, setDoc } from 'firebase/firestore/lite';
  import { success, error } from '$components/toast/theme';
  import { Checkbox } from 'svelte-ux';

  let gotData = false;
  let docId = '';

  let schemaData = {
    openAIAPIKey: '',
    pineconeAPIKey: '',
    type: 'individual',
    shareKeyWithDomain: false,
    domain: ''
  };

  $: {
    if ($user?.uid) {
      getKeys($user?.uid);
    }
  }

  let getKeys = async (uid) => {
    if (uid) {
      const q = query(keysCollection, where('uid', '==', uid));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        docId = querySnapshot.docs[0].id;
        const res = { ...schemaData, ...querySnapshot.docs[0].data() };
        schemaData = res;
      }
      gotData = true;
    }
  };

  const schema = z.object({
    openAIAPIKey: z.string().length(51, 'OpenAI API key must be 51 characters'),
    pineconeAPIKey: z.string().length(36, 'Pinecone API key must be 36 characters'),
    type: z.enum(['individual', 'organization']),
    organizationName: z.string().optional(),
    shareKeyWithDomain: z.boolean().optional(),
    domain: z.string().optional(),
    uid: z.string()
  });

  let options = [
    { label: $__('individual'), value: 'individual' },
    { label: $__('organization'), value: 'organization' }
  ];

  let onSubmit = async () => {
    const data = { ...schemaData, uid: $user.uid };
    try {
      schema.parse(data);
    } catch (err) {
      error(err.message);
      return;
    }
    console.log(data);
    if (docId) {
      const docRef = doc(keysCollection, docId);
      await setDoc(docRef, data, { merge: true });
      success($__('keys_updated'));
    } else {
      await addDoc(keysCollection, data);
      success($__('keys_added'));
    }
  };
</script>

<div class="container">
  <div class="item">
    <br />
    <h1>{$__('profile')}</h1>
    <br />
    <p>
      {$__('this_page_enables_you_to_manage_your_api_keys')}
    </p>
    <br />

    <h2>{$__('keys')}</h2>
    <br />

    {#if gotData}
      {#if $user && $user?.uid}
        <div class="grid gap-2">
          <TextField
            label={$__('open_ai_key')}
            value={schemaData.openAIAPIKey}
            on:change={(e) => {
              schemaData.openAIAPIKey = e.detail.value;
            }}
          />
          <TextField
            label={$__('pinecone_key')}
            value={schemaData.pineconeAPIKey}
            on:change={(e) => {
              schemaData.pineconeAPIKey = e.detail.value;
            }}
          />
          <SelectField
            {options}
            optionText={(x) => $__(x.value)}
            label={$__('type')}
            value={schemaData.type}
            on:change={(e) => {
              schemaData.type = e.detail.value;
            }}
          />
          {#if schemaData.type == 'organization'}
            <!-- org name -->
            <TextField
              label={$__('organization_name')}
              value={schemaData.organizationName}
              on:change={(e) => {
                schemaData.organizationName = e.detail.value;
              }}
            />
            <p>{$__('share_keys_with_domain')}</p>
            <Checkbox bind:checked={schemaData.shareKeyWithDomain} />
            {#if schemaData.shareKeyWithDomain}
              <TextField
                label={$__('domain')}
                value={schemaData.domain}
                placeholder={$__('js_regex_allowed')}
                on:change={(e) => {
                  schemaData.domain = e.detail.value;
                }}
              />
            {/if}
          {/if}
        </div>
        <br />
        <Button on:click={onSubmit}>{$__('apply')}</Button>
        <Button type="reset">{$__('cancel')}</Button>
      {/if}
    {/if}
  </div>
</div>

<style>
  .container {
    display: flex; /* Use flexbox layout */
    justify-content: center; /* Center the child horizontally */
    max-width: 800px; /* Set the maximum width */
    margin: 0 auto; /* This will center the div in the page */
  }

  .item {
    flex: 1; /* Allow the item to grow and shrink as needed */
    max-width: 800px; /* Ensure it doesn't grow past 800px */
  }
</style>
