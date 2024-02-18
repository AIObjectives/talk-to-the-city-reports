<script lang="ts">
  import Button from '@smui/button';
  import Select, { Option } from '@smui/select';
  import { loadTemplates } from '$lib/templates';
  import { type DocumentData } from 'firebase/firestore';
  import { onMount } from 'svelte';
  import Paper from '@smui/paper';
  import { _ as __ } from 'svelte-i18n';
  import _ from 'lodash';
  import { Dataset } from '$lib/dataset';

  let templates: Record<string, DocumentData> = {};
  let loadingTemplates = true;
  let template: DocumentData;
  export let dataset: Dataset;

  onMount(async () => {
    templates = await loadTemplates();
    loadingTemplates = false;
  });
</script>

{#if loadingTemplates}
  <p>{$__('loading_templates')}...</p>
{:else if !_.isEmpty(templates)}
  <div class="w-full px-3" style="position: relative;">
    <Select style="min-width: 400px;" label={$__('report_template')} bind:value={dataset.template}>
      {#each Object.keys(templates) as templateKey}
        <Option
          value={templateKey}
          on:click={() => {
            template = templates[templateKey];
          }}>{$__(templateKey)}</Option
        >
      {/each}
    </Select>
    <Paper class="my-5 w-full">
      {#if template}
        {$__('are_you_sure_apply_template')}
        <Button
          type="button"
          color="primary"
          on:click={() => {
            dataset.graph.nodes.set(template.nodes);
            dataset.graph.edges.set(template.edges);
            dataset.graph.conform(false, false);
            template = null;
          }}
        >
          {$__('apply')}
        </Button>
        <Button
          type="button"
          color="secondary"
          on:click={() => {
            template = null;
          }}
        >
          {$__('cancel')}
        </Button>
      {:else}
        <div class="docs">
          {$__('template_help')}
        </div>
      {/if}
    </Paper>
  </div>
{:else}
  <p>{$__('no_templates_found')}</p>
{/if}
