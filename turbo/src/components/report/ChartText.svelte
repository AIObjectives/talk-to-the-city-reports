<script>
  import { fade } from 'svelte/transition';
  import { _ as __ } from 'svelte-i18n';
  import _ from 'lodash';
  export let node;
  export let scale = 1;

  function splitToLines(text, width) {
    const words = text.split(' ');
    let lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      if (currentLine.length + words[i].length + 1 > width) {
        lines.push(currentLine);
        currentLine = words[i];
      } else {
        currentLine += ' ' + words[i];
      }
    }
    lines.push(currentLine);

    return lines;
  }
  // Make fontSize reactive and dependent on scale
  $: fontSize = scale > 0 ? 0.9 / scale : 0.9;

  // Now other reactive statements that depend on fontSize
  $: lineHeight = fontSize * 20;
  $: textBlockHeight = lines.length * lineHeight;
  $: yPosition = lines.length > 1 ? node.y - textBlockHeight / 2.5 : node.y;

  let text = node.data.name;
  if (node.children) {
    text =
      node.data.name + ' (' + _.map(node.children.length.toString(), (c) => $__(c)).join('') + ')';
  }
  let lines = splitToLines(text, 20);
</script>

<g in:fade|local>
  <text
    x={node.x}
    y={yPosition}
    class="inter-font pointer-events-none text-anchor-middle paint-order-stroke"
    style:font-size="{fontSize}rem"
    style:stroke-width="{fontSize * 2}px"
  >
    {#each lines as line, index (line)}
      <tspan x={node.x} dy={index > 0 ? lineHeight : 0}>{line}</tspan>
    {/each}
  </text>
</g>

<style>
  .inter-font {
    font-family: 'Inter', sans-serif;
  }

  .text-anchor-middle {
    text-anchor: middle;
  }

  .paint-order-stroke {
    paint-order: stroke;
  }
</style>
