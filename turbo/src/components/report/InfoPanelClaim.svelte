<script lang="ts">
  import { _ as __ } from 'svelte-i18n';

  import { HHMMSSToSeconds } from '$lib/utils';
  import Player from './Player.svelte';

  export let showVideo: boolean;
  export let claim: any;
  export let csv: any;
  export let showClaims: boolean;

  let videoSrc: string;

  function buildVideoLink(video, timestamp) {
    // Define regular expressions for YouTube and Vimeo URLs
    const youtubeRegex =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
    const vimeoRegex = /vimeo\.com\/(\d+)/;

    let embedUrl = '';
    const startTimeInSeconds = HHMMSSToSeconds(timestamp);

    if (youtubeRegex.test(video)) {
      // Extract video ID using the regex for YouTube links
      const videoId = video.match(youtubeRegex)[1];
      embedUrl = `https://www.youtube.com/embed/${videoId}?start=${startTimeInSeconds}`;
    } else if (vimeoRegex.test(video)) {
      // Extract video ID using the regex for Vimeo links
      const videoId = video.match(vimeoRegex)[1];
      embedUrl = `https://player.vimeo.com/video/${videoId}#t=${startTimeInSeconds}s`;
    }

    return embedUrl;
  }

  $: if (claim.commentId && showVideo && csv) {
    let csvEntry: Record<string, any> = csv.find(
      (entry: any) => entry['comment-id'] === claim.commentId
    );
    if (claim?.timestamp && csvEntry?.video)
      videoSrc = buildVideoLink(csvEntry?.video, claim?.timestamp);
    else if (csvEntry?.video && csvEntry?.timestamp) {
      videoSrc = buildVideoLink(csvEntry?.video, csvEntry?.timestamp);
    }
  }
</script>

<div class="inner-div p-2">
  {#if showClaims}
    <h5>{$__('claim')}:</h5>
    <i>{claim.claim}</i>
    <br />
    <br />
  {/if}
  <i>"{claim.quote}"</i>
  <br />
  <br />
  {#if claim.interview}
    <p>{$__('interview')}: {claim.interview}</p>
  {/if}
  {#if showVideo && videoSrc}
    <Player src={videoSrc} />
  {/if}
</div>

<style>
  .inner-div {
    max-height: 100%;
  }
</style>
