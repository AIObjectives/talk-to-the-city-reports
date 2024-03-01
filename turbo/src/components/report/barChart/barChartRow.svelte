<script lang="ts">
  import _ from 'lodash';
  import { hsl } from 'd3-color';
  import { _ as __ } from 'svelte-i18n';
  import { ordinalColor, scrollToTopic } from '$lib/reportUtils';
  import { isMobile } from '$lib/store';

  export let max: number;
  export let complexHierarchy: Record<string, any>;
  export let height: number = 30;
  export let color: string = '';
  export let level: 'top' | 'topic' = 'top';

  let _color = color || '' + hsl(ordinalColor(complexHierarchy.data.name));

  $: width = (complexHierarchy.value / max) * (clientWidth / 2);
  $: textColor = width < 80 ? 'gray' : 'white';
  $: textX = width < 80 ? width + 5 : 10;
  $: textY = height / 2;
  $: description =
    level === 'top'
      ? complexHierarchy.data.topicShortDescription
      : complexHierarchy.data.subtopicShortDescription;
  let clientWidth: number = 1;
  let clientHeight: number = 1;
  let hoverColor: string = '#ffcc00';
  let hovering: boolean = false;
</script>

<button
  class={'flex-container ' + (isMobile ? 'px-1' : 'px-2')}
  style="text-align: left;"
  bind:clientWidth
  bind:clientHeight
  tabindex="0"
  on:click={() => scrollToTopic(complexHierarchy.data.name)}
  on:mouseover={() => {
    hoverColor = ('' + _color).replace('rgb', 'rgba').replace(')', ', 0.1)');
    document.documentElement.style.setProperty('--hover-color', hoverColor);
    hovering = true;
  }}
  on:focus={() => {
    hoverColor = ('' + _color).replace('rgb', 'rgba').replace(')', ', 0.1)');
    document.documentElement.style.setProperty('--hover-color', hoverColor);
    hovering = true;
  }}
  on:mouseout={() => {
    document.documentElement.style.removeProperty('--hover-color');
    hovering = false;
  }}
  on:blur={() => {
    document.documentElement.style.removeProperty('--hover-color');
    hovering = false;
  }}
>
  <div class="flex-item text-section py-2">
    <h4>{complexHierarchy.data.name}</h4>
    <small>
      {_.truncate(description, { length: 150 })}
    </small>
  </div>
  <svg class="separator" width="2" height={clientHeight}>
    <line x1="1" y1="0" x2="1" y2={clientHeight} stroke="#ddd" stroke-width="1" />
  </svg>
  <svg height={height + 46} {width} class="flex-item bar-section py-2">
    <rect {width} {height} fill={_color} />
    <text
      x={textX}
      y={textY}
      xmlns="http://www.w3.org/2000/svg"
      fill={textColor}
      dominant-baseline="middle"
      text-anchor="left"
      font-weight="bold">{complexHierarchy.value + ' ' + $__('claims')}</text
    >
    {#if hovering}
      <text
        x={textX}
        y={textY + 35}
        fill="black"
        dominant-baseline="middle"
        text-anchor="left"
        font-size="small"
        style="pointer-events: none;"
        >{$__(level === 'top' ? 'click_to_view_topic' : 'click_to_view_subtopic')}</text
      >
    {/if}
  </svg>
</button>

<style>
  .flex-container {
    display: flex;
    align-items: stretch;
    width: 100%;
  }
  .flex-item {
    flex: 1;
  }
  .text-section {
    margin-right: 20px;
  }
  .separator {
    flex: none;
    margin-right: 0px;
  }
  .bar-section {
    display: block;
  }
  .flex-container:hover {
    background-color: var(--hover-color);
  }
</style>
