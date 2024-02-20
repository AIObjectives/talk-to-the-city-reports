<script>
  import _ from 'lodash';
  import { _ as __ } from 'svelte-i18n';

  import { chartMode } from '$lib/store';

  import MenuItem from '$components/rightMenu/menu_item.svelte';

  let modes = ['bar', 'circle'];
  let i = modes.indexOf($chartMode);
</script>

<MenuItem
  on:click={(e) => {
    i = ++i % modes.length;
    $chartMode = modes[i];
  }}
  label={`${$__(modes[(i + 1) % modes.length])} ${$__('chart')}`}
/>
