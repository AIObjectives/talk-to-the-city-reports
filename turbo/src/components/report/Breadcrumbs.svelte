<script>
  import { Breadcrumb, Button } from 'svelte-ux';
  export let selected;
  export let format;
  export let onSelect;
</script>

<Breadcrumb items={selected?.ancestors().reverse() ?? []}>
  <Button slot="item" let:item on:click={() => onSelect(item)} base class="px-2 py-1 rounded">
    <div class="text-left">
      <div class="text-sm">{item.data.name}</div>
      <div class="text-xs text-black/50">{format(item.value, 'integer')}</div>
    </div>
  </Button>
</Breadcrumb>
