<script>
  import { Button, Dialog, TextField } from 'svelte-ux';
  export let open = false;
  import { saveTemplate } from '$lib/templates';

  let name = '';
  let data = '';
</script>

<Dialog {open}>
  <div slot="title">Save JSON as template</div>
  <div class="p-2">
    <TextField bind:value={name} label="template name" autofocus />
    {name}
  </div>
  <div class="p-2">
    <TextField bind:value={data} label="template JSON body" />
  </div>
  <div slot="actions">
    <Button
      variant="fill"
      color="primary"
      on:click={() => {
        saveTemplate(name, JSON.parse(data));
      }}>OK</Button
    >
    <Button
      on:click={() => {
        open = false;
      }}>Cancel</Button
    >
  </div>
</Dialog>
