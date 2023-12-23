<script lang="ts">
	import { user } from '$lib/store';
	import { _ as __ } from 'svelte-i18n';
	import _ from 'lodash';
	import { locale } from 'svelte-i18n';
	import Cookies from 'js-cookie';
	import { languages } from '$lib/i18n';
	import Select, { Option } from '@smui/select';
</script>

<footer>
	{$__('developed_by')} <a href="https://objective.is">AI Objectives Institute</a>
	{#if $user}
		{$__('logged_in_as')} {$user.displayName}
	{/if}
	<Select value={Cookies.get('locale')} style="width: 80px;">
		{#each _.keys(languages) as l}
			<Option
				value={l}
				on:click={(x) => {
					locale.set(l);
					Cookies.set('locale', l);
				}}>{languages[l]}</Option
			>
		{/each}
	</Select>
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
