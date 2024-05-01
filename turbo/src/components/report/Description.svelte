<script lang="ts">
  import Switch from '@smui/switch';
  import Checkbox from '@smui/checkbox';
  import FormField from '@smui/form-field';
  import HelperText from '@smui/textfield/helper-text';
  import TextField from '@smui/textfield';
  import { globalViewMode, reportStore } from '$lib/store';
  import Pencil from '$lib/icons/PencilOutline.svelte';
  import { user } from '$lib/store';
  import { _ as __ } from 'svelte-i18n';

  export let dataset;
  let editing = false;
  let isPublic = !dataset.isPrivate;

  $: dataset.isPrivate = !isPublic;

  $: isStandard = $globalViewMode === 'standard';
  $: showDrawer = isStandard && $reportStore?.topics?.length > 0;
  $: userIsOwner = $user && dataset.owner === $user.uid;
</script>

{#if userIsOwner && editing}
  <div
    class="flex flex-col px-2 my-4 max-w-full pl-8 mx-auto {!showDrawer ? 'lg:max-w-[800px]' : ''}"
  >
    <TextField bind:value={dataset.title} label={$__('title')} />
    <TextField
      helperLine$style="width: 100% !important;"
      style="width: 100%; overflow: auto"
      textarea
      bind:value={dataset.description}
    >
      <HelperText slot="helper">{$__('description')}</HelperText>
    </TextField>
    <FormField>
      <div>
        <Checkbox
          checked={dataset.enableForking}
          on:change={(x) => {
            // @ts-ignore
            dataset.enableForking = x.target.checked;
          }}
        />
      </div>
      <span slot="label">{$__('enable_forking')}</span>
    </FormField>
    <div class="w-full px-3 py-5">
      <FormField>
        <Switch bind:checked={isPublic} />
        <span slot="label">{$__(isPublic ? 'public' : 'private')}</span>
      </FormField>
    </div>
    <button on:click={() => (editing = false)}>{$__('done')}</button>
  </div>
{:else}
  <div
    class="flex flex-col px-2 my-4 max-w-full mx-auto pl-10 mb-5 {!showDrawer
      ? 'lg:max-w-[800px]'
      : ''}"
    id="description"
  >
    <h1 class="text-left text-3xl my-8 text-gray-800 relative group">
      {#if userIsOwner}
        <button
          class="absolute left-[-10px] hidden group-hover:block"
          on:click={() => (editing = true)}><Pencil size="15px" color={'gray'} /></button
        >
      {/if}
      {dataset.title}
    </h1>
    <p class="text-gray-700" style="white-space: pre-line;">
      {$__('description')}: {dataset.description}
    </p>
    {#if $user && dataset.projectParent}
      <p class="text-gray-500">
        {$__('forked_from')}:
        <a href="/report/{dataset.projectParent}" class="text-gray-500 hover:text-gray-700">
          {dataset.projectParent}
        </a>
      </p>
    {/if}
  </div>
{/if}
