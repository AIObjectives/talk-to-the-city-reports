<script lang="ts">
  import Menu from '@smui/menu';
  import List, { Item, Separator, Text } from '@smui/list';
  import Button, { Label } from '@smui/button';

  export let showMenu: boolean = false;
  export let menu: Menu;
  let clicked = 'nothing yet';
  $: menu?.setOpen(showMenu);
</script>

<div style="min-width: 100px;">
  <Menu bind:this={menu}>
    <List>
      <Item on:SMUI:action={() => (clicked = 'Cut')}>
        <Text>Cut</Text>
      </Item>
      <Item on:SMUI:action={() => (clicked = 'Copy')}>
        <Text>Copy</Text>
      </Item>
      <Item on:SMUI:action={() => (clicked = 'Paste')}>
        <Text>Paste</Text>
      </Item>
      <Separator />
      <Item on:SMUI:action={() => (clicked = 'Delete')}>
        <Text>Delete</Text>
      </Item>
    </List>
  </Menu>
</div>

<pre class="status">Clicked: {clicked}</pre>
