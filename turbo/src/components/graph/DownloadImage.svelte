<script lang="ts">
  import { toJpeg } from 'html-to-image';
  import { getNodesBounds, getViewportForBounds, useNodes } from '@xyflow/svelte';
  import ImageOutline from '$lib/icons/ImageOutline.svelte';

  const nodes = useNodes();

  const imageWidth = 1024 * 4;
  const imageHeight = 768 * 4;

  function handleClick() {
    const nodesBounds = getNodesBounds($nodes);
    const viewport = getViewportForBounds(nodesBounds, imageWidth, imageHeight, 0.5, 2.0, 0.2);

    const viewportDomNode = document.querySelector<HTMLElement>('.svelte-flow__viewport')!;

    if (viewport) {
      const zoomOutFactor = 0.7;
      const adjustedZoom = viewport.zoom * zoomOutFactor;
      const translateAdjustmentX = (imageWidth * (1 - zoomOutFactor)) / 2;
      const translateAdjustmentY = (imageHeight * (1 - zoomOutFactor)) / 2;

      toJpeg(viewportDomNode, {
        backgroundColor: '#eff3f9',
        width: imageWidth,
        height: imageHeight,
        style: {
          width: `${imageWidth}px`,
          height: `${imageHeight}px`,
          transform: `translate(${viewport.x + translateAdjustmentX}px, ${
            viewport.y + translateAdjustmentY
          }px) scale(${adjustedZoom})`
        }
      }).then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'svelte-flow.jpg';
        link.href = dataUrl;
        link.click();
      });
    }
  }
</script>

<button on:click={handleClick}><ImageOutline size="30" /></button>
