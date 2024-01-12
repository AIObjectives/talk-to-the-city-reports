<script lang="ts">
	import _ from 'lodash';
	import Select, { Option } from '@smui/select';
	import { locale } from 'svelte-i18n';
	import Cookies from 'js-cookie';

	import { languages } from '$lib/i18n';
</script>

<div class="lang-container">
	<Select value={_.includes(_.keys(languages), $locale) ? $locale : 'en-US'} style="width: 70px;">
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
</div>

<style>
	:global(.lang-container .smui-select--standard .mdc-select__anchor) {
		height: 30px;
	}
</style>
