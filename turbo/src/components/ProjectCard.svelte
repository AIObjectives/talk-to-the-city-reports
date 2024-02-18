<script lang="ts">
  import Close from '$lib/icons/Close.svelte';
  import { Dataset } from '$lib/dataset';
  import { _ as __ } from 'svelte-i18n';
  import { slide } from 'svelte/transition';
  import Button from '@smui/button';
  import Card from '@smui/card';
  import { onMount } from 'svelte';
  import Cookies from 'js-cookie';

  export let showOwner: boolean = false;
  export let dataset: Dataset;
  export let loadDatasets: () => Promise<void>;

  let ownerEmail = '';

  onMount(async () => {
    let token = Cookies.get('user_token');
    ownerEmail = await fetch('/api/users/info/email?uid=' + dataset.owner, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => data.email);
  });

  const deleteDataset = async () => {
    const assets: string[] = await dataset.graph.listAssets();
    if (confirm($__('are_you_sure_delete_dataset') + '\n\n' + assets.join('\n'))) {
      await dataset.deleteDataset();
      loadDatasets();
    }
  };
</script>

<div in:slide={{ duration: 300 }} out:slide={{ duration: 300 }}>
  <Card class="w-72 relative rounded overflow-hidden m-4 p-4">
    <span class="absolute top-0 right-0 cursor-pointer mt-2 mr-2">
      <button on:click={deleteDataset}><Close /></button>
    </span>
    <p class="font-bold text-xl mb-2">{dataset.title}</p>
    <p class="text-gray-700 text-base">{dataset.description.slice(0, 100)}</p>
    <a href="/report/{dataset.slug}"> <Button>{$__('view_report')}</Button></a>
    <p class="text-gray-400 text-base"><small>/{dataset.slug}</small></p>
    {#if showOwner}
      <p class="text-gray-400 text-base"><small>Owner: {ownerEmail}</small></p>
    {/if}
  </Card>
</div>
