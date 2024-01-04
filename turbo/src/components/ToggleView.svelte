<script>
	import _ from 'lodash';
	import MenuItem from './menu/menu_item.svelte';
	import { fitViewStore } from '$lib/store';
	import { _ as __ } from 'svelte-i18n';
	import { globalViewMode } from '$lib/store';

	let modes = ['standard', 'graph'];
	let i = modes.indexOf($globalViewMode);
</script>

<MenuItem
	on:click={(e) => {
		i = ++i % modes.length;
		$globalViewMode = modes[i];
		$fitViewStore += 1;
	}}
	label={`${$__(modes[(i + 1) % modes.length])} ${$__('view')}`}
/>
