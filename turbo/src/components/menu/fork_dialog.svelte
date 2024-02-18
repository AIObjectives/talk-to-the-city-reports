<script lang="ts">
  import Dialog, { Title, Content, Actions } from '@smui/dialog';
  import Button, { Label } from '@smui/button';
  import Textfield from '@smui/textfield';
  import { page } from '$app/stores';
  import { storeDataset } from '$lib/store';
  import { Dataset } from '$lib/dataset';
  import { _ as __ } from 'svelte-i18n';

  export let modalShowing: boolean = false;
  export let showDropdown: boolean = false;

  let message = '';
  let focused = false;
  let value: string = '';
  let dirty = false;
  let invalid = false;
  let reportPath: string;

  $: disabled = focused || !value || !dirty || invalid;
  $: {
    reportPath = $page.route.id?.startsWith('/report/');
  }

  async function handleOk() {
    message = '';
    const exists = await Dataset.exists(value);
    if (exists) {
      message = $__('a_report_with_this_name_already_exists');
      invalid = true;
    } else {
      await $storeDataset!.fork(value);
      message = $__('forking_report');
      modalShowing = false;
      showDropdown = false;
    }
  }

  function handleCancel() {
    modalShowing = false;
    showDropdown = false;
  }
</script>

{#if reportPath}
  <Dialog open={modalShowing} aria-labelledby="simple-title" aria-describedby="simple-content">
    <Title id="simple-title">{$__('fork_report')}</Title>
    <Content id="simple-content">
      <p>{$__('you_are_about_to_create_a_fork_of_this_report')}</p>
      <br />
      <Textfield
        type="text"
        bind:dirty
        bind:invalid
        updateInvalid
        value={$page.params.report}
        on:change={(e) => (value = e.target.value)}
        label={$__('fork')}
        style="min-width: 100%;"
        on:focus={() => (focused = true)}
        on:blur={() => (focused = false)}
        withTrailingIcon={!disabled}
      />
      <br />
    </Content>
    <p class="ml-5 mb-2">{message}</p>
    <Button on:click={handleOk}>
      <Label>{$__('ok')}</Label>
    </Button>
    <Button on:click={handleCancel}>
      <Label>{$__('cancel')}</Label>
    </Button>
  </Dialog>
{/if}
