<script lang="ts">
  import { onMount } from 'svelte';
  import { getContext } from 'svelte';

  import { type NodeProps } from '@xyflow/svelte';
  import { marked } from 'marked';
  import _ from 'lodash';
  import { _ as __ } from 'svelte-i18n';
  import Cookies from 'js-cookie';

  import { pipelineStepsRemaining } from '$lib/store';
  import register from '$lib/node_register';
  import { Dataset } from '$lib/dataset';

  import Checkbox from '@smui/checkbox';
  import FormField from '@smui/form-field';
  import Paper from '@smui/paper';
  import Card from '@smui/card';

  import { Position, Handle } from '@xyflow/svelte';
  import { useNodes } from '@xyflow/svelte';
  import { useSvelteFlow } from '@xyflow/svelte';
  import { useUpdateNodeInternals } from '@xyflow/svelte';

  import Help from '$lib/icons/HelpCircle.svelte';
  import Tune from '$lib/icons/Tune.svelte';
  import Circle from '$lib/icons/Circle.svelte';
  import TuneDGNode from './dgnode/TuneDGNode.svelte';
  import Logs from '$components/Logs.svelte';
  import DGNodeBadge from '$components/DGNodeBadge.svelte';

  type $$Props = NodeProps;

  export let position: unknown = undefined;
  position;
  export let dragHandle: $$Props['dragHandle'] = undefined;
  dragHandle;
  export let type: $$Props['type'] = undefined;
  type;
  export let selected: $$Props['selected'] = undefined;
  export let isConnectable: $$Props['isConnectable'] = undefined;
  isConnectable;
  export let zIndex: $$Props['zIndex'] = undefined;
  zIndex;
  export let width: $$Props['width'] = undefined;
  width;
  export let height: $$Props['height'] = undefined;
  height;
  export let dragging: $$Props['dragging'];
  dragging;
  export let targetPosition: $$Props['targetPosition'] = undefined;
  targetPosition;
  export let sourcePosition: $$Props['sourcePosition'] = undefined;
  sourcePosition;
  export let xPos = undefined;
  xPos;
  export let yPos = undefined;
  yPos;
  export let data: $$Props['data'];
  export let id: $$Props['id'];
  export let style: string = '';
  export let isStandardView: boolean = false;
  export let color = '';
  export let variant = 'raised';
  export let _class = '';
  export let positionAbsolute;

  const updateNodeInternals = useUpdateNodeInternals();

  const { flowToScreenPosition, getZoom } = useSvelteFlow();
  const dataset: Dataset = getContext('dataset');
  const nodes = useNodes();

  let dg_node = dataset?.graph.find(id);
  let show_help = false;
  let doc;
  let inlineDoc;
  let showLogs = false;
  let tune = false;

  let divHeight = 0;
  let divWidth = 0;
  let rects = {};
  let mounted = false;
  let _style = `position: relative; ${style}; `;

  $: posY = positionAbsolute?.y ? flowToScreenPosition(positionAbsolute)?.y : 0;

  onMount(() => {
    updateRects();
    mounted = true;
  });

  $: {
    const node = $nodes.find((node) => node.id === id);
    if (mounted && node) {
      node.width = divWidth > 500 ? divWidth : 500;
      node.height = divHeight;
    }
  }

  function updateRects() {
    rects = {};
    _.keys(data.input_ids)
      .sort()
      .forEach((inputId) => {
        const element = document.getElementById(`input-${id}-${inputId}`);
        if (element) {
          const rect = element.getBoundingClientRect();
          rects[`input-${id}-${inputId}`] = Math.round((rect.top - posY) / getZoom());
        }
      });
    // Currently only one output is supported
    if (data.output_ids) {
      _.keys(data.output_ids)
        .sort()
        .forEach((outputId) => {
          const element = document.getElementById(`output-${id}-${outputId}`);
          if (element) {
            const rect = element.getBoundingClientRect();
            rects[`output-${id}-${outputId}`] = Math.round((rect.top - posY) / getZoom());
          }
        });
    }
  }

  $: if (data.input_ids) {
    divHeight;
    if (positionAbsolute) {
      updateNodeInternals(id);
      updateRects();
    }
  }

  const getDocs = async (locale) => {
    doc = await register.getDocs(data.compute_type, locale);
    inlineDoc = await register.getInlineDocs(data.compute_type, locale);
  };

  function onConnect(x) {
    let { source, target, sourceHandle, targetHandle } = x.detail.connection;
    dataset?.graph.onConnect(source, target, sourceHandle, targetHandle);
  }

  $: variant = isStandardView ? 'raised' : 'outlined';
  $: show = isStandardView ? data.show_in_ui === undefined || data.show_in_ui === true : true;
  $: {
    const locale = Cookies.get('locale') || 'en-US';
    getDocs(locale);
    if (dg_node) {
      $nodes;
      selected;
    }
  }

  $: {
    if (data?.processing == true && isStandardView && $pipelineStepsRemaining > 0) {
      const el = document.getElementById('dgnode-' + isStandardView + id);
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  }
</script>

{#if data && show}
  <div
    bind:clientHeight={divHeight}
    bind:clientWidth={divWidth}
    id={'dgnode-' + isStandardView + id}
    style="scroll-margin-top: 70px"
  >
    <Paper
      color={isStandardView ? 'default' : color}
      variant={isStandardView ? 'raised' : variant}
      title={data?.compute_type}
      class={(selected ? 'selected-dg-node' : 'dg-node') + ' ' + _class}
      style={_style}
    >
      {#if data?.icon}
        <div style="float: left; margin-right: 0.5rem;" class="w-6 h-6">
          <!-- svelte-ignore a11y-missing-attribute -->
          <img
            style="width: 100%; height: 100%; object-fit: contain;"
            src="/{data.icon}.png"
            class="w-6 h-6"
          />
        </div>
      {/if}

      <div>
        {$__(data.label)}
        {#if !isStandardView}<small class="mb-4 text-gray-400">{id}</small>{/if}
      </div>

      <div class="help-icon-wrapper">
        {#if data?.log?.length > 0}
          <button
            on:click={() => {
              showLogs = !showLogs;
            }}
          >
            <DGNodeBadge logs={data.log} />
          </button>
          &nbsp;&nbsp;
        {/if}
        {#if !isStandardView || data?.show_settings_in_standard_view}
          <button
            on:click={() => {
              tune = !tune;
            }}><Tune color="gray" /></button
          >&nbsp;&nbsp;
        {/if}
        {#if doc}
          <button on:click={() => (show_help = !show_help)}><Help color="gray" /></button>
        {/if}
        {#if data.processing}
          <Circle color="#aaffaa" class="mr-2" />
        {/if}
      </div>

      {#if show_help}
        <Paper class="mb-5" style="min-width: 500px;">
          <div class="docs">
            <h3>{data.compute_type} {$__('node_documentation')}</h3>
            {@html marked.parse(doc)}
          </div>
        </Paper>
      {/if}

      {#if showLogs}
        <Logs logs={data.log} />
      {/if}
      {#if tune}
        <TuneDGNode bind:data {dataset} />
      {/if}
      {#if isStandardView && inlineDoc}
        <div class="text-sm text-gray-900 my-5">{@html marked.parse(inlineDoc)}</div>
      {/if}
      <slot />
      {#if data?.dirty}
        <div class="text-sm text-gray-500">{$__('unsaved_changes')}</div>
      {/if}
      {#if data?.message}
        <div class="text-sm text-gray-500">{@html data?.message}</div>
      {/if}
      {#if _.isBoolean(data.enable)}
        <FormField align="end">
          <span
            ><Checkbox
              checked={data.enable === true}
              on:change={(x) => {
                data.enable = x.target.checked;
              }}
            /></span
          >
          <span slot="label">{$__('enable')}</span>
        </FormField>
      {/if}
      {#if !isStandardView}
        {#each _.keys(data.input_ids).sort() as inputId}
          <Card style="min-height: 50px; padding: 10px;" variant="outlined">
            <div
              id={`input-${id}-${inputId}`}
              title={`top: ${rects[`input-${id}-${inputId}`] + 10}px;`}
            >
              <p>{$__('input')}: {inputId}</p>
            </div>
          </Card>
        {/each}
        {#if data.output_ids}
          {#each _.keys(data.output_ids).sort() as outputId, i}
            <Card style="min-height: 50px; padding: 10px;" variant="outlined">
              <div
                id={`output-${id}-${outputId}`}
                title={`top: ${rects[`output-${id}-${outputId}`] + 10}px;`}
              >
                <p style="float: right;">{$__('output')}: {outputId}</p>
              </div>
            </Card>
          {/each}
        {/if}
      {/if}
    </Paper>
  </div>
  {#if !isStandardView}
    {#each _.keys(data.input_ids).sort() as inputId}
      {#if rects[`input-${id}-${inputId}`]}
        <Handle
          id={inputId}
          type="target"
          position={Position.Left}
          on:connect={onConnect}
          style={`top: ${rects[`input-${id}-${inputId}`] + 10}px;`}
        />
      {/if}
    {/each}
    {#if data.output_ids}
      {#each _.keys(data.output_ids).sort() as outputId}
        {#if rects[`output-${id}-${outputId}`]}
          <Handle
            id={outputId}
            type="source"
            position={Position.Right}
            on:connect={onConnect}
            style={`top: ${rects[`output-${id}-${outputId}`] + 10}px;`}
          />
        {/if}
      {/each}
    {:else}
      <Handle type="source" position={Position.Right} on:connect={onConnect} />
    {/if}
  {/if}
{/if}

<style>
  :global(.svelte-flow .svelte-flow__handle) {
    width: 30px;
    height: 14px;
    border-radius: 3px;
    border-color: #3342a5;
    background-color: rgb(200, 203, 223);
  }

  :global(.svelte-flow .svelte-flow__handle-top) {
    top: -10px;
  }

  :global(.svelte-flow__edge-path) {
    stroke-width: 50;
    stroke: #ccccff;
  }

  :global(.svelte-flow__edge-interaction) {
    stroke-width: 50 !important;
    stroke: rgb(255, 0, 149) !important;
  }

  :global(.svelte-flow .svelte-flow__handle-bottom) {
    bottom: -10px;
  }

  :global(.svelte-flow .svelte-flow__edge path, .svelte-flow__connectionline path) {
    stroke-width: 3;
    stroke: rgb(185, 191, 220);
  }
  .help-icon-wrapper {
    position: absolute;
    top: 10px;
    right: 10px;
    display: flex;
    align-items: center;
  }
</style>
