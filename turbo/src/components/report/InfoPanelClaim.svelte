<script lang="ts">
	import Paper from '@smui/paper';
	import _ from 'lodash';
	import { _ as __ } from 'svelte-i18n';
	import type { Dataset } from '$lib/dataset';
	import Fuse from 'fuse.js';

	export let clickEvent: any = undefined;
	export let showVideo: boolean;
	export let claim: any;
	export let csv: any;
	export let dataset: Dataset;
	export let showClaims: boolean;
	export let timestamps: any;

	let tsClaim: any;
	let newIframeSrc: string;
	let claimCommentId: string = claim.commentId;

	function buildVimeoLink(video, timestamp) {
		const parts = video.split('/');
		// convert HH:MM:SS to seconds
		const totalSeconds = timestamp
			.split(':')
			.reverse()
			.reduce((prev, curr, i) => prev + curr * Math.pow(60, i), 0);
		const videoId = parts[parts.length - 1];
		return `https://player.vimeo.com/video/${videoId}#t=${totalSeconds}s`;
	}

	$: if (claimCommentId && showVideo && csv) {
		let csvEntry = csv.find((entry: any) => entry['comment-id'] === claimCommentId);
		if (_.isEmpty(timestamps)) {
			if (claim?.timestamp && csvEntry?.video)
				newIframeSrc = buildVimeoLink(csvEntry?.video, claim?.timestamp);
			else if (csvEntry?.video && csvEntry?.timestamp)
				newIframeSrc = buildVimeoLink(csvEntry?.video, csvEntry?.timestamp);
		} else {
			const interviewClaims = timestamps.filter((entry: any) => {
				return entry['interview'] === claim.interview;
			});
			const fuse = new Fuse(interviewClaims, {
				includeMatches: true,
				includeScore: true,
				threshold: 0.6,
				ignoreLocation: true,
				location: 0,
				distance: 100,
				isCaseSensitive: true,
				keys: ['comment-body']
			});
			const results = fuse.search(claim.quote);
			tsClaim = _.minBy(results, (r) => r.score);
			if (tsClaim?.item) newIframeSrc = buildVimeoLink(tsClaim.item);
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
