<script lang="ts">
  import _ from 'lodash';
  import { _ as __ } from 'svelte-i18n';

  import type { Log } from '$lib/node_data_types';

  import Paper from '@smui/paper';

  import { oneDark } from '@codemirror/theme-one-dark';
  import { javascript } from '@codemirror/lang-javascript';
  import CodeMirror from 'svelte-codemirror-editor';

  import { ExpansionPanel } from 'svelte-ux';

  export let logs: Log[] = [];
</script>

{#if logs?.length > 0}
  <Paper class="mb-5" style="min-width: 500px;">
    <div class="docs">
      <h3>{$__('logs')}</h3>
      {#each logs as log}
        <ExpansionPanel disabled={!log.detail}>
          <div slot="trigger" class="flex-1 p-3" style={log.type == 'error' ? 'color: red' : ''}>
            {log.title}
          </div>
          <div>
            {#if _.isString(log.detail)}
              <CodeMirror value={log.detail.trim()} theme={oneDark} lang={javascript()} />
            {:else if _.isPlainObject(log.detail) || _.isArray(log.detail)}
              <CodeMirror
                value={JSON.stringify(log.detail, null, 2)}
                theme={oneDark}
                lang={javascript()}
              />
            {:else}
              <pre>{log.detail}</pre>
            {/if}
          </div>
        </ExpansionPanel>
      {/each}
    </div>
  </Paper>
{/if}
