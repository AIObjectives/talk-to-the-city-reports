<script>
	import _ from 'lodash';
	import Cookies from 'js-cookie';
	import MenuItem from './menu/menu_item.svelte';
	import { viewMode, fitViewStore } from '$lib/store';
	import { _ as __ } from 'svelte-i18n';

	let modes = ['standard', 'dual', 'graph'];
	let i = modes.indexOf($viewMode);
</script>

<MenuItem
	on:click={(e) => {
		i = ++i % modes.length;
		$viewMode = modes[i];
		Cookies.set('viewMode', $viewMode);
		$fitViewStore += 1;
	}}
	label={`${$__(modes[(i + 1) % modes.length])} ${$__('view')}`}
/>
