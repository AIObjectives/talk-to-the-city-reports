<script lang="ts">
	import InfoPanel from '$components/report/InfoPanel.svelte';
	import { Popover } from 'svelte-ux';

	import { _ as __ } from 'svelte-i18n';
	import _ from 'lodash';

	export let showFeedback: boolean = false;
	export let csv: any;
	export let claims: any;

	let open = false;
</script>

{#if _.isArray(claims)}
	<span
		class="claim"
		role="button"
		tabindex="0"
		on:mousedown={() => {
			open = true;
		}}
	>
		<i>• {claims[0]?.claim}</i>
		{#if claims.length > 1}
			<small class="repeated">
				({$__('repeated')}
				{_.map(claims.length.toString(), (c) => $__(c)).join('')}
				{$__('times')})</small
			>
		{/if}
	</span>
	{#if open}
		<Popover bind:open padding={10} class="z-1">
			<InfoPanel {csv} {claims} showClaims={false} showVideo={true} on:feedback {showFeedback} />
		</Popover>
	{/if}
{/if}

<style>
	:global(.Popover) {
		max-width: 300px;
		max-height: 300px;
		overflow-y: auto;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
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
