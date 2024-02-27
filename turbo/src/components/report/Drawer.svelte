<script lang="ts">
  import { _ as __ } from 'svelte-i18n';
  import _ from 'lodash';
  import { slide } from 'svelte/transition';

  import { hsl } from 'd3-color';

  import { ordinalColor, scrollToTopic } from '$lib/reportUtils';
  import { globalViewMode, reportStore, isMobile, openLeftDrawer } from '$lib/store';

  import Circle from '$lib/icons/Circle.svelte';
  export let showDrawer: boolean;

  $: isStandard = $globalViewMode === 'standard';
  $: showDrawer = (!$isMobile || $openLeftDrawer) && isStandard && $reportStore?.topics?.length > 0;

  let hoverColor = '#ffcc00';
</script>

{#if showDrawer}
  <div
    id="drawerBackground"
    class={$isMobile ? 'box-shadow' : ''}
    in:slide={{ duration: 300, axis: 'x' }}
    out:slide={{ duration: 300, axis: 'x' }}
  >
    <div class="drawer-wrapper">
      <div class="custom-drawer mt-4 hide-scrollbar">
        <button
          class="mt-2 block"
          on:click={() => {
            document.getElementById('graph-container').scrollIntoView({ behavior: 'smooth' });
          }}
          ><h5>
            {$__('overview')}
          </h5></button
        >
        <button
          class="mt-2 nav-section"
          on:click={() => {
            document.getElementById('report-container').scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <h5>{$__('clusters')}</h5>
        </button>
        {#each $reportStore?.topics as topic}
          <button
            class="topic-item mt-2 block"
            on:click={() => scrollToTopic(topic.topicName)}
            on:mouseover={() => {
              hoverColor = ('' + hsl(ordinalColor(topic.topicName)))
                .replace('rgb', 'rgba')
                .replace(')', ', 0.1)');
              document.documentElement.style.setProperty('--hover-color', hoverColor);
            }}
            on:focus={() => {
              hoverColor = ('' + hsl(ordinalColor(topic.topicName)))
                .replace('rgb', 'rgba')
                .replace(')', ', 0.1)');
              document.documentElement.style.setProperty('--hover-color', hoverColor);
            }}
            on:mouseout={() => {
              document.documentElement.style.removeProperty('--hover-color');
            }}
            on:blur={() => {
              document.documentElement.style.removeProperty('--hover-color');
            }}
            type="button"
          >
            <span><Circle color={'' + hsl(ordinalColor(topic.topicName))} /></span>
            &nbsp;
            <span>{_.truncate(topic.topicName, { length: 20 })}</span>
          </button>
          {#each topic.subtopics as subtopic}
            <button
              class="topic-item ml-6"
              on:click={() => scrollToTopic(subtopic.subtopicName)}
              on:mouseover={() => {
                hoverColor = ('' + hsl(ordinalColor(subtopic.topicName)))
                  .replace('rgb', 'rgba')
                  .replace(')', ', 0.1)');
                document.documentElement.style.setProperty('--hover-color', hoverColor);
              }}
              on:focus={() => {
                hoverColor = ('' + hsl(ordinalColor(subtopic.topicName)))
                  .replace('rgb', 'rgba')
                  .replace(')', ', 0.1)');
                document.documentElement.style.setProperty('--hover-color', hoverColor);
              }}
              on:mouseout={() => {
                document.documentElement.style.removeProperty('--hover-color');
              }}
              on:blur={() => {
                document.documentElement.style.removeProperty('--hover-color');
              }}
              type="button"
            >
              <small>{_.truncate(subtopic.subtopicName, { length: 30 })}</small>
            </button>
          {/each}
        {/each}
        <button
          class="mt-2 block"
          on:click={() => {
            document.getElementById('appendix').scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <h5>
            {$__('appendix')}
          </h5>
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  #drawerBackground {
    background-color: #f2f2f2;
    width: 256px;
    height: 120%;
    position: fixed;
    z-index: 1;
    overflow-y: auto;
  }

  .box-shadow {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  .drawer-wrapper {
    width: 256px;
    height: 100%;
    overflow: hidden;
  }

  .custom-drawer {
    width: inherit;
    height: calc(100vh - 60px);
    padding: 0 1.5rem;
    box-sizing: border-box;
    overflow-y: auto;
    color: rgba(0, 0, 0, 0.75);
  }

  .topic-item {
    display: flex;
    align-items: center;
    gap: 2px;
    padding-left: 0.5rem;
    cursor: pointer;
    width: 100%;
  }

  .topic-item:hover {
    background-color: var(--hover-color);
  }
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
</style>
