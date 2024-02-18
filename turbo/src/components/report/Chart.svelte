<script lang="ts">
  import { onMount } from 'svelte';
  import { Chart, Svg, Group, Pack, Zoom } from 'layerchart';
  import { cubicOut } from 'svelte/easing';
  import ChartText from './ChartText.svelte';
  import ChartCircle from './ChartCircle.svelte';
  import { createEventDispatcher } from 'svelte';

  export let complexHierarchy: any;
  export let getNodeColor: any;

  const dispatch = createEventDispatcher();
  let padding = 3;
  let zoom: any;
  export let selected: any;

  onMount(() => {
    selected = complexHierarchy;
  });

  $: selected = complexHierarchy;

  $: if (zoom && selected) {
    if (selected.x != undefined && selected.y != undefined) {
      const diameter = selected.r * 2;
      zoom.zoomTo({ x: selected.x, y: selected.y }, { width: diameter, height: diameter });
    }
  }

  function selectedNodes(nodes: any) {
    return nodes.filter((node: any) => {
      if (node === selected) {
        return true;
      }
      const depthFilter = node.depth <= (selected ? selected.depth + 1 : 1);
      const parentFilter = node.depth !== 3 || (selected && node.parent === selected);
      return depthFilter && parentFilter;
    });
  }
</script>

<Chart data={complexHierarchy}>
  <Svg>
    <Zoom
      translateOnScale={false}
      bind:this={zoom}
      let:scale
      tweened={{ duration: 800, easing: cubicOut }}
      disablePointer
      on:click={(e) => {
        selected = complexHierarchy;
        dispatch('click', { event: 'click', x: e.clientX, y: e.clientY });
      }}
    >
      <Pack {padding} let:nodes>
        {#each selectedNodes(nodes) as node (node.data.name + '-' + node.depth + '-' + node.x + '-' + node.y)}
          <Group
            x={node.x}
            y={node.y}
            on:click={(e) => {
              dispatch('click', { event: 'click', x: e.clientX, y: e.clientY });
              e.stopPropagation();
              selected = node;
            }}
            class="cursor-pointer hover:contrast-[1.2]"
          >
            <ChartCircle {node} {scale} {getNodeColor} on:mouseenter on:mouseleave on:click />
          </Group>
        {/each}
        {#each selected ? selected.children ?? [selected] : [] as node (node.data.name + '-' + node.depth + '-' + node.x + '-' + node.y)}
          {#if node.depth < 3 || (node.depth == 3 && node.parent.children.length <= 5)}
            <ChartText {node} {scale} />
          {/if}
        {/each}
      </Pack>
    </Zoom>
  </Svg>
</Chart>
