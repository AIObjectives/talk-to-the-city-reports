<script lang="ts">
  import { type NodeProps } from '@xyflow/svelte';
  import DGNode from '$components/graph/nodes/DGNode.svelte';
  import FormField from '@smui/form-field';
  import TextField from '@smui/textfield';
  import Button from '@smui/button';

  interface TextToCSVEntry {
    interview: string;
    video: string;
    timestamp: string;
  }

  type $$Props = NodeProps;
  export let data: $$Props['data'];

  function addEntry() {
    data.entries = [
      ...data.entries,
      {
        interview: 'Alice',
        video: '',
        timestamp: ''
      }
    ];
  }

  function removeEntry(index: number) {
    data.entries = [...data.entries.slice(0, index), ...data.entries.slice(index + 1)];
  }

  function updateEntry(index: number, field: keyof TextToCSVEntry, value: string) {
    data.entries = data.entries.map((entry, i) =>
      i === index ? { ...entry, [field]: value } : entry
    );
  }
</script>

<DGNode {...$$restProps} {data}>
  <FormField>
    <TextField
      label="Num tokens per line"
      bind:value={data.numTokens}
      on:input={(e) => updateEntry(index, 'interview', e.target.value)}
    />
  </FormField>
  <div>
    <Button on:click={addEntry}>Add Entry</Button>
  </div>
  <div>
    {#each data.entries as entry, index}
      <div class="entry-form">
        <FormField>
          <TextField
            label="Interview"
            bind:value={entry.interview}
            on:input={(e) => updateEntry(index, 'interview', e.target.value)}
          />
        </FormField>
        <FormField>
          <TextField
            label="Video"
            bind:value={entry.video}
            on:input={(e) => updateEntry(index, 'video', e.target.value)}
          />
        </FormField>
        <FormField>
          <TextField
            label="Timestamp"
            bind:value={entry.timestamp}
            on:input={(e) => updateEntry(index, 'timestamp', e.target.value)}
          />
        </FormField>
        <Button class="remove-entry-btn" on:click={() => removeEntry(index)}>delete</Button>
      </div>
    {/each}
  </div>
</DGNode>

<style>
  .entry-form {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  }
  .remove-entry-btn {
    margin-left: 8px;
  }
</style>
