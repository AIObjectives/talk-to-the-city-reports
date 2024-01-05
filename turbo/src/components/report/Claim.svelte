<script lang="ts">
	import InfoPanel from '$components/report/InfoPanel.svelte';
	import Tooltip, { Wrapper, Content } from '@smui/tooltip';

	import { _ as __ } from 'svelte-i18n';
	import _ from 'lodash';

	export let showFeedback: boolean = false;
	export let dataset: any;
	export let csv: any;
	export let claims: any;

	let tooltipVisible = false;
</script>

<Wrapper rich>
	<span
		class="claim"
		role="button"
		tabindex="0"
		on:mousedown={() => {
			tooltipVisible = true;
		}}
	>
		<i>• {claims[0].claim}</i>
		{#if claims.length > 1}
			<small class="repeated">
				({$__('repeated')}
				{_.map(claims.length.toString(), (c) => $__(c)).join('')}
				{$__('times')})</small
			>
		{/if}
	</span>
	{#if tooltipVisible}
		<Tooltip style="min-width: 300px; background-color: white;" persistent>
			<Content class="scrollable-content">
				<InfoPanel
					{dataset}
					{csv}
					{claims}
					showClaims={false}
					showVideo={true}
					on:feedback
					{showFeedback}
				/>
			</Content>
		</Tooltip>
	{/if}
</Wrapper>

<style>
	:global(.mdc-tooltip__content) {
		max-height: 300px;
		overflow-y: auto;
	}
	.claim {
		cursor: pointer;
	}
	.claim:hover {
		color: red;
	}
	.repeated {
		background-color: #eeeeff;
	}
</style>
