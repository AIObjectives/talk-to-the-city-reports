<script lang="ts">
  import { Badge } from 'svelte-ux';
  import RobotOutline from '$lib/icons/RobotOutline.svelte';
  import type { Log } from '$lib/node_data_types';

  export let logs: Log[] = [];
</script>

<Badge
  value={logs?.length}
  small
  class={logs.some((log) => log.type === 'error') ? 'bg-red-500' : 'bg-blue-500'}
>
  <RobotOutline />
</Badge>
