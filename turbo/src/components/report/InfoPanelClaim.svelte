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
		const parts = video.split('/');
		const videoId = parts[parts.length - 1].split('?')[0];
		let embedUrl = '';
		if (video.includes('vimeo.com')) {
			embedUrl = `https://player.vimeo.com/video/${videoId}#t=${HHMMSSToSeconds(timestamp)}s`;
		} else if (video.includes('youtube.com')) {
			const startTimeInSeconds = HHMMSSToSeconds(timestamp);
			embedUrl = `https://www.youtube.com/embed/${videoId}?start=${startTimeInSeconds}`;
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
	<h5>{$__('quote')}:</h5>
	<i>"{claim.quote}"</i>
	<br />
	<br />
	{#if claim.interview}
		<h5>{$__('interview')}:</h5>
		{claim.interview}
		<br />
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
