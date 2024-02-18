<script lang="ts">
  export let src: string;

  let playerTitle = '';
  let playerAllow = '';
  let playerVisible = false;

  $: {
    if (src.includes('youtube.com')) {
      playerTitle = 'YouTube video player';
      playerAllow =
        'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      playerVisible = true;
    } else if (src.includes('vimeo.com')) {
      playerTitle = 'Vimeo Video Player';
      playerAllow = 'autoplay; fullscreen; picture-in-picture';
      playerVisible = true;
    } else {
      playerVisible = false;
    }
  }
</script>

<div class="iframe-container mt-3">
  {#if playerVisible}
    <iframe
      id="player"
      {src}
      class="responsive-iframe"
      title={playerTitle}
      frameborder="0"
      allow={playerAllow}
      allowfullscreen
    />
  {/if}
</div>

<style>
  .iframe-container {
    position: relative;
    width: 100%;
    padding-top: 56.25%;
  }

  .responsive-iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 0;
  }
</style>
