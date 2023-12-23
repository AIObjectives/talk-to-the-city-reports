<script lang="ts">
	import InfoPanel from '$components/report/InfoPanel.svelte';
	import Tooltip, { Wrapper, Content } from '@smui/tooltip';

	import { _ as __ } from 'svelte-i18n';
	import _ from 'lodash';

	export let showFeedback: boolean = false;
	export let dataset: any;
	export let csv: any;
	export let claims: any;
</script>

<Wrapper rich>
	<span class="claim">
		<i>• {claims[0].claim}</i>
		{#if claims.length > 1}
			<small class="repeated">
				({$__('repeated')}
				{_.map(claims.length.toString(), (c) => $__(c)).join('')}
				{$__('times')})</small
			>
		{/if}
	</span>

	<Tooltip style="min-width: 300px; background-color: white;" persistent>
		<Content>
			<InfoPanel
				{dataset}
				{csv}
				{claims}
				showClaims={false}
				showVideo={false}
				on:feedback
				{showFeedback}
			/>
		</Content>
	</Tooltip>
</Wrapper>

<style>
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
