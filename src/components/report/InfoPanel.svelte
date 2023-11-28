<script>
	export let clickEvent;
	export let csv;
	import { _ } from 'svelte-i18n';

	let video;
	let newIframeSrc;
	$: {
		if (clickEvent) {
			let entry = csv.find((entry) => entry['comment-id'] === clickEvent.node.data.claim.id);
			if (entry && entry.video && entry.timestamp) {
				claimId = parseInt(clickEvent.node.data.claim.id);
				video = entry.video;
				let [hours, minutes, seconds] = entry.timestamp.split(':').map(Number);
				let totalSeconds = hours * 3600 + minutes * 60 + seconds;
				const parts = video.split('/');
				const videoId = parts[parts.length - 1];
				newIframeSrc = `https://player.vimeo.com/video/${videoId}#t=${totalSeconds}s`;
			}
		}
	}
</script>

{#if clickEvent}
	<div class="outer-div">
		<div class="inner-div p-2">
			<p>{$_('claim')}:</p>
			{clickEvent.node.data.name}
			<br />
			<br />
			<p>{$_('home')}:</p>
			{clickEvent.node.data.claim.quote}
			<br />
			<br />
			{#if clickEvent.node.data.claim.interview}
				<p>{$_('interview')}:</p>
				{clickEvent.node.data.claim.interview}
				<br />
			{/if}
			{#if newIframeSrc}
				<div class="iframe-container">
					<iframe
						class="responsive-iframe"
						src={newIframeSrc}
						frameborder="0"
						allow="autoplay; fullscreen; picture-in-picture"
						allowfullscreen
					/>
				</div>
			{/if}
		</div>
	</div>
{/if}

<style>
	.outer-div {
		height: 400px;
	}

	.inner-div {
		max-height: 100%;
		overflow: auto;
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
