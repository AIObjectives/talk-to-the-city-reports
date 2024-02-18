<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import Tab, { Label } from '@smui/tab';
  import TabBar from '@smui/tab-bar';
  import { node_register } from '$lib/templates';
  import node_categories from '$lib/node_categories';
  import _ from 'lodash';
  import { _ as __ } from 'svelte-i18n';
  import { user } from '$lib/store';

  let tabs;
  export let active = { nodes: [] };
  let timeoutDuration = 3000;
  let timeoutId;

  onMount(() => {
    resetTimeout();
  });

  $: {
    resetTimeout();
  }

  export function resetTimeout() {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      active = { nodes: [] };
      const activeTab = document.querySelector('.mdc-tab--active');
      const activeIndicator = document.querySelector('.mdc-tab-indicator--active');
      if (activeTab) {
        activeTab.classList.remove('mdc-tab--active');
      }
      if (activeIndicator) {
        activeIndicator.classList.remove('mdc-tab-indicator--active');
      }
    }, timeoutDuration);
  }

  onDestroy(() => {
    clearTimeout(timeoutId);
  });

  $: isAdmin = $user?.uid === import.meta.env.VITE_ADMIN;

  $: tabs = _.keys(node_categories)
    .filter((category) => (!isAdmin ? category != 'wip' : true))
    .map((category: string) => {
      return {
        label: $__(node_categories[category].label),
        nodes: node_register.filter((node) => node.data.category === category)
      };
    });
</script>

<div class="toolbar">
  {#if tabs}
    <TabBar {tabs} let:tab bind:active>
      <Tab
        {tab}
        on:mouseenter={() => {
          active = tab;
          resetTimeout();
        }}
        style="max-height: 25px;  overflow: hidden;"
        minWidth
      >
        <Label style="position: relative; top: -12px; color: white;">{tab.label}</Label>
      </Tab>
    </TabBar>
  {/if}
</div>

<style>
  .toolbar {
    background: #2e4387;
  }
</style>
