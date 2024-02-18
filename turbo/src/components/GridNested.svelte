<script lang="ts">
  import { oneDark } from '@codemirror/theme-one-dark';
  import CodeMirror from 'svelte-codemirror-editor';
  import { json } from '@codemirror/lang-json';
  import Pencil from '$lib/icons/PencilOutline.svelte';
  import Grid from '$components/Grid.svelte';
  import _ from 'lodash';
  export let id;
  export let data: Array<{ [key: string]: any }>;
  export let isStandardView: boolean;

  let currentPage = 1;
  const itemsPerPage = 10;
  let editing = false;

  const convertData = (d) => {
    if (_.isString(_.head(d))) {
      d = _.map(d, (item) => [item]);
    } else if (_.isPlainObject(d)) {
      const values = _.values(d);
      if (values.length === 1) {
        if (_.isArray(values[0])) {
          d = values[0];
        } else if (_.isPlainObject(values[0])) {
          d = [values[0]];
        }
      } else if (values.length > 1) {
        d = _.values(values);
      }
    }

    let mData = [];
    let iWn = [];
    if (!_.isArray(d)) {
      return mData;
    }
    _.forEach(d, (row) => {
      if (_.some(_.values(row), _.isArray)) {
        if (iWn.length > 0) {
          mData.push({ data: iWn, indent: false });
          iWn = [];
        }
        mData.push({
          data: [_.omitBy(row, _.isArray)],
          indent: false
        });
        mData.push({
          data: _.find(_.values(row), _.isArray) || [],
          indent: true
        });
      } else {
        iWn.push(row);
      }
    });
    if (iWn.length > 0) {
      mData.push({ data: iWn, indent: false });
    }
    return mData;
  };

  $: modData = convertData(data);
  $: totalPages = Math.ceil(modData.length / itemsPerPage);

  function changePage(newPage) {
    if (newPage >= 1 && newPage <= totalPages) {
      currentPage = newPage;
    }
  }
</script>

{#if modData && modData.length}
  <div class="nowheel nodrag" style="position: relative;">
    <button
      style="position: absolute; z-index: 10000;"
      on:click={() => {
        editing = !editing;
      }}><Pencil /></button
    >
    {#if editing}
      <CodeMirror
        value={JSON.stringify(data, null, 2)}
        theme={oneDark}
        lang={json()}
        className="nodrag; nowheel;"
        style="min-width: 500px; min-height: 600px; height: 100%; width: 100%;"
        options={{ autoresize: true, lineWrapping: true }}
      />
    {:else}
      {#if totalPages > 1}
        <button on:click={() => changePage(currentPage - 1)}>Previous</button>
        <button on:click={() => changePage(currentPage + 1)}>Next</button>
      {/if}
      {#each modData as item, index (item)}
        {#if index >= (currentPage - 1) * itemsPerPage && index < currentPage * itemsPerPage}
          {#if item.indent}
            <div class={item.indent ? 'ml-5' : ''}>
              <svelte:self data={item.data} {id} {isStandardView} />
            </div>
          {:else}
            <Grid data={item.data} {id} {isStandardView} />
          {/if}
        {/if}
      {/each}
    {/if}
  </div>
{/if}
