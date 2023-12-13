<script lang="ts">
	import Paper from '@smui/paper';
	import { _ as __ } from 'svelte-i18n';
	import type { Dataset } from '$lib/dataset';

	export let showVideo: boolean;
	export let claim: any;
	export let csv: any;
	export let dataset: Dataset;
	export let showClaims: boolean;

	let video: string;
	let newIframeSrc: string;
	let claimCommentId: string = claim.commentId;

	$: if (claimCommentId && showVideo && csv) {
		let entry = csv.find((entry: any) => entry['comment-id'] === claimCommentId);
		if (entry && entry.video && entry.timestamp) {
			video = entry.video;
			let [hours, minutes, seconds] = entry.timestamp.split(':').map(Number);
			let totalSeconds = hours * 3600 + minutes * 60 + seconds;
			const parts = video.split('/');
			const videoId = parts[parts.length - 1];
			newIframeSrc = `https://player.vimeo.com/video/${videoId}#t=${totalSeconds}s`;
		}
	}
</script>

<Paper class="m-0 p-0" square>
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
</Paper>

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
