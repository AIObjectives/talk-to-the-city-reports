<script>
  import _ from 'lodash';
  import { _ as __ } from 'svelte-i18n';

  import { fitViewStore } from '$lib/store';
  import { globalViewMode } from '$lib/store';

  import MenuItem from '$components/rightMenu/menu_item.svelte';

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
