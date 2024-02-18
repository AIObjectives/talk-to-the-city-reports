<script lang="ts">
  import Carousel from 'svelte-carousel';
  import { browser } from '$app/environment';

  let carousel;

  const images = [1, 2, 3];
</script>

{#if browser}
  <div class="flex justify-center items-center">
    <div style="width: 100%; max-width: 800px;">
      <Carousel
        autoplay
        autoplayDuration={5000}
        autoplayProgressVisible
        pauseOnFocus
        bind:this={carousel}
      >
        {#each images as image}
          <img
            alt="talk to the city ${image}"
            src={`https://talktothecity.s3.us-west-1.amazonaws.com/tttc-turbo/static/carousel/img0${image}.jpg`}
          />
        {/each}
      </Carousel>
      <br />
      <br />
      <p style="m4">
        Talk to the City is a tool for collective intent alignment, helping policymakers understand
        in detail what the polity thinks and why.
      </p>
      <br />
      <br />
    </div>
  </div>
{/if}

<!-- <Carousel autoplay autoplayDuration={5000} autoplayProgressVisible pauseOnFocus>
	{#each colors as { color, text } (color)}
		<Color {color} {text} />
	{/each}
</Carousel> -->
