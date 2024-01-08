<script lang="ts">
	import _ from 'lodash';
	import { _ as __ } from 'svelte-i18n';

	export let showVideo: boolean;
	export let claim: any;
	export let csv: any;
	export let showClaims: boolean;

	let newIframeSrc: string;
	let claimCommentId: string = claim.commentId;

	function buildVimeoLink(video: string, timestamp: string) {
		const parts = video.split('/');
		// convert HH:MM:SS to seconds
		const totalSeconds = timestamp
			.split(':')
			.reverse()
			.reduce((prev: number, curr: any, i) => prev + curr * Math.pow(60, i), 0);
		const videoId = parts[parts.length - 1];
		return `https://player.vimeo.com/video/${videoId}#t=${totalSeconds}s`;
	}

	$: if (claimCommentId && showVideo && csv) {
		let csvEntry = csv.find((entry: any) => entry['comment-id'] === claimCommentId);
		if (claim?.timestamp && csvEntry?.video)
			newIframeSrc = buildVimeoLink(csvEntry?.video, claim?.timestamp);
		else if (csvEntry?.video && csvEntry?.timestamp)
			newIframeSrc = buildVimeoLink(csvEntry?.video, csvEntry?.timestamp);
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
	{#if showVideo && newIframeSrc}
		<div class="iframe-container mt-3">
			<iframe
				class="responsive-iframe"
				src={newIframeSrc}
				frameborder="0"
				allow="autoplay; fullscreen; picture-in-picture"
				allowfullscreen
				title="Video Player"
			/>
		</div>
	{/if}
</div>

<style>
	.inner-div {
		max-height: 100%;
	}

	.iframe-container {
		position: relative;
		width: 100%;
		padding-top: 56.25%; /* 16:9 Aspect Ratio */
	}

	.responsive-iframe {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		border: 0; /* Optional: Removes the border */
	}
</style>
