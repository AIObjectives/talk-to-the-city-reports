<script>
	export let clickEvent;
	export let csv;
	let claimId;
	let video;
	let newIframeSrc;
	$: {
		if (clickEvent) {
			claimId = parseInt(clickEvent.node.data.claim.id);
			video = csv[claimId].video;
			let [hours, minutes, seconds] = csv[claimId].timestamp.split(':').map(Number);
			let totalSeconds = hours * 3600 + minutes * 60 + seconds;
			const parts = video.split('/');
			const videoId = parts[parts.length - 1];
			newIframeSrc = `https://player.vimeo.com/video/${videoId}#t=${totalSeconds}s`;
		}
	}
</script>

{#if clickEvent}
	<div class="outer-div">
		<div class="inner-div p-2">
			<p>Claim:</p>
			{clickEvent.node.data.name}
			<br />
			<br />
			<p>Quote:</p>
			{clickEvent.node.data.claim.quote}
			<br />
			<br />
			<p>Interview:</p>
			{clickEvent.node.data.claim.interview}
			<br />
			<iframe
				src={newIframeSrc}
				width="320"
				height="240"
				frameborder="0"
				allow="autoplay; fullscreen; picture-in-picture"
				allowfullscreen
			/>
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
</style>
