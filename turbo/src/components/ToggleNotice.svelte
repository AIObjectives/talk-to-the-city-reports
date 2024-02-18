<script lang="ts">
  import Button from '@smui/button';
  import Tune from '$lib/icons/Tune.svelte';
  import { fitViewStore, graphNotice } from '$lib/store';
  import { _ as __ } from 'svelte-i18n';
  import { getContext } from 'svelte';
  let viewMode = getContext('viewMode');
</script>

<div style="max-width: 800px;" class="p-4 text-gray-600">
  <Button
    style="width: 300px;"
    class="mt-5"
    on:click={(e) => {
      $viewMode = 'graph';
      $fitViewStore += 1;
      window.scrollTo(0, 0);
      $graphNotice = true;
    }}
  >
    <Tune size="30px" /> &nbsp; {$__('switch_to_graph_view')}
  </Button>
  <br />
  <p class="ml-8">{$__('graph_view_notice_0')}</p>
</div>
