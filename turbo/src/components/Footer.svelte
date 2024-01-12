<script lang="ts">
	import { _ as __ } from 'svelte-i18n';
	import _ from 'lodash';

	import { user } from '$lib/store';
</script>

<footer>
	{$__('developed_by')} <a href="https://objective.is">AI Objectives Institute</a>
	{#if $user}
		{$__('logged_in_as')} {$user.displayName}
	{/if}
</footer>

<style>
	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 12px;
	}

	footer a {
		font-weight: bold;
	}

	@media (min-width: 480px) {
		footer {
			padding: 12px 0;
		}
	}
</style>
