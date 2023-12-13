<script>
	import Textfield from '@smui/textfield';
	import Tooltip, { Wrapper, Title, Content, Link, RichActions } from '@smui/tooltip';

	let showTooltip = false;

	function show() {
		showTooltip = true;
	}

	function hide() {
		showTooltip = false;
	}
</script>

<div class="trigger" on:mouseenter={show} on:mouseleave={hide}>
	Hover over me
	{#if showTooltip}
		<Tooltip persistent={true}>
			<Content>blah</Content>
		</Tooltip>
	{/if}
</div>

<style>
	.trigger {
		/* Style for your trigger element */
		cursor: pointer;
	}
</style>
