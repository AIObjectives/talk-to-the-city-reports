<script>
	import Cookies from 'js-cookie';
	import _ from 'lodash';
	import MenuItem from './menu/menu_item.svelte';
	import { viewMode, fitViewStore } from '$lib/store';
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
	label={`${_.capitalize(modes[(i + 1) % modes.length])} view`}
/>
