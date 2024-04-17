<script lang="ts">
  import { get } from 'svelte/store';

  import _ from 'lodash';
  import { _ as __ } from 'svelte-i18n';
  import { hsl } from 'd3-color';
  import { hierarchy } from 'd3-hierarchy';

  import { reportStore, isMobile, chartMode } from '$lib/store';

  import { Dataset } from '$lib/dataset';
  import type { FeedbackNodeInterface } from '$lib/compute/feedback_v0';
  import type { CSVNodeInterface } from '$lib/compute/csv_v0';
  import { getNodeColor, ordinalColor } from '$lib/reportUtils';

  import BubbleChart from '$components/report/Chart.svelte';
  import Claims from '$components/report/Claims.svelte';
  import Tooltip from '$components/report/Tooltip.svelte';
  import InfoPanel from '$components/report/InfoPanel.svelte';
  import FeedbackDialog from './FeedbackDialog.svelte';
  import Appendix from '$components/report/appendix/Appendix.svelte';
  import BarChart from '$components/report/barChart/barChart.svelte';

  export let dataset: Dataset;

  let report: any;
  let csv: any;

  function transformData(originalData: any) {
    return {
      name: '',
      children: _.map(originalData.topics, (topic) => ({
        name: topic.topicName,
        topicShortDescription: topic.topicShortDescription,
        children: _.map(topic.subtopics, (subtopic) => {
          const groupedClaims = _.groupBy(subtopic.claims, 'claim');
          const claims = _.map(groupedClaims, (claimGroup, claimName) => ({
            name: claimName,
            claims: claimGroup,
            value: claimGroup.length
          }));
          return {
            name: subtopic.subtopicName,
            subtopicShortDescription: subtopic.subtopicShortDescription,
            ...(claims.length > 0 ? { children: claims } : { value: 1 })
          };
        })
      }))
    };
  }

  let complexHierarchy: any;

  let report_node;
  let csv_node: CSVNodeInterface;
  let feedbackNode: FeedbackNodeInterface;

  $: {
    if (dataset) {
      const report_node_v0 = get(dataset.graph.nodes).find(
        (n) => n.data?.compute_type === 'report_v0'
      );
      const report_node_v1 = get(dataset.graph.nodes).find(
        (n) => n.data?.compute_type === 'report_v1'
      );
      if (report_node_v0) {
        csv_node = (get(dataset.graph.nodes).find((n) => n.data?.compute_type === 'csv_v0') ||
          get(dataset.graph.nodes).find(
            (n) => n.data?.compute_type === 'json_v0'
          )) as CSVNodeInterface;
        report_node = report_node_v0;
        report = report_node.data.output;
        csv = csv_node?.data.output;
      } else if (report_node_v1) {
        report_node = report_node_v1;
        report = report_node_v1.data.output[report_node_v1.data.output_ids.merge];
        csv = report_node_v1.data.output[report_node_v1.data.output_ids.csv];
      }

      reportStore.set(report);

      feedbackNode = get(dataset.graph.nodes).find(
        (n) => n.data?.compute_type === 'feedback_v0'
      ) as FeedbackNodeInterface;
      if (!_.isEmpty(report)) {
        let transformedData = transformData(report);
        complexHierarchy = hierarchy(transformedData).sum((d: any) => d.value);
      }
    }
  }

  let tooltipEvent: any;
  let clickEvent: any;
  let feedbackEvent: any;
  let showInfoPanel = false;
  $: gridTemplateColumns = showInfoPanel ? '1fr 400px' : '1fr';
  let selected: any;
</script>

<FeedbackDialog {dataset} claims={feedbackEvent} />

<!-- Charts -->
<div
  class="graph-container"
  id="graph-container"
  class:info-active={showInfoPanel}
  style="--grid-template-columns: {gridTemplateColumns}"
>
  {#if complexHierarchy}
    {#if $chartMode == 'circle'}
      <Tooltip {tooltipEvent} />
      <div class="chart-wrapper" class:selected={selected?.depth > 1}>
        <BubbleChart
          {complexHierarchy}
          {getNodeColor}
          bind:selected
          on:click={(e) => {
            if (e?.detail?.node) {
              tooltipEvent = null;
              clickEvent = e.detail;
            }
            showInfoPanel = !!e?.detail?.node;
          }}
          on:mouseenter={(e) => (tooltipEvent = e.detail)}
          on:mouseleave={(e) => (tooltipEvent = null)}
        />
      </div>
    {/if}
    {#if showInfoPanel}
      <div class="info-panel">
        <InfoPanel
          scrollHeight={'400px'}
          showFeedback={feedbackNode?.data.enable_input}
          {clickEvent}
          {csv}
          on:feedback={(e) => {
            feedbackEvent = e.detail;
          }}
        />
      </div>
    {/if}
  {/if}
</div>

<!-- Bar Chart -->
<!-- x-margins intentionally smaller than other report sections to keep all
     text aligned while allowing for extra bar chart row padding on hover -->
<div class={($isMobile ? 'mx-4' : 'mx-8') + ' mb-7 mt-5'}>
  {#if $chartMode == 'bar'}
    {#if complexHierarchy}
      <BarChart {complexHierarchy} level="top" />
    {/if}
  {/if}
</div>

<!-- Report -->
<div class={($isMobile ? 'mx-5' : 'mx-10') + ' report-container mt-12'} id="report-container">
  {#if report && report.topics}
    {#each report.topics as topic}
      {@const topicColor = hsl(ordinalColor(topic.topicName)).brighter(-1)}
      <div
        id={_.kebabCase('report-' + topic.topicName)}
        class="mt-12 pt-4"
        style="scroll-margin-top: 45px"
      />
      <!-- TODO scroll-margin-top above does not seem to affect scroll target;
			     top padding added to position topic header on scroll -->
      <div>
        <!-- Topic title -->
        <div class="flex justify-between">
          <span style="max-width: 740px;">
            <h2 class="text-2xl font-bold" style="color: {topicColor}">
              {topic.topicName}
            </h2>
          </span>
          <a
            href="javascript:void(0)"
            on:click={() => {
              document.getElementById('graph-container').scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <p>
              {$__('back_to_overview')}
              <small style="vertical-align:text-bottom">↑</small>
            </p>
          </a>
        </div>
        <!-- Topic stats etc. -->
        <small
          style="padding-left: 2px; color: {hsl(ordinalColor(topic.topicName)).brighter(
            -2
          )};  max-width: 740px;"
        >
          {_.map(
            _.sumBy(
              topic.subtopics,
              // @ts-ignore
              (subtopic) => _.uniqBy(subtopic.claims, 'claim').length
            ).toString(),
            (c) => $__(c)
          ).join('')}
          {$__('claims') + ', '}
          {_.map(topic.subtopics.length.toString(), (c) => $__(c)).join('')}
          {$__('subtopics')}
        </small>
        <!-- Topic description -->
        {#if topic.topicShortDescription}
          <h6 class="mt-4 mb-4" style="max-width: 740px;">{topic.topicShortDescription}</h6>
        {/if}
        <!-- Topic Bar chart (of subtopics) -->
        <div class={'mt-5 mb-8 ' + ($isMobile ? '' : 'mx-6')}>
          {#if $chartMode == 'bar'}
            {#if complexHierarchy}
              <BarChart
                complexHierarchy={complexHierarchy.children.find(
                  (x) => x.data.name === topic.topicName
                )}
                color={'' + topicColor.brighter(1)}
                level="topic"
              />
            {/if}
          {/if}
        </div>
        <!-- Subtopics -->
        {#each topic.subtopics as subtopic (subtopic.subtopicName + subtopic.claims.length)}
          <div
            id={_.kebabCase('report-' + subtopic.subtopicName)}
            style="scroll-margin-top: 45px"
          />
          <div
            class="text-lg mt-8"
            style="color: {topicColor}; display: flex; justify-content: space-between;"
          >
            <h3>{subtopic.subtopicName}</h3>
          </div>
          <small style="padding-left: 1px;">
            {_.map(_.uniqBy(subtopic.claims, 'claim').length.toString(), (c) => $__(c)).join('')}
            {$__('claims')}</small
          >
          {#if subtopic.subtopicShortDescription}
            <div class="my-2" style="max-width: 740px;">
              <h7>{subtopic.subtopicShortDescription}</h7>
            </div>
          {/if}
          <Claims
            {csv}
            claims={subtopic.claims}
            on:feedback={(e) => {
              feedbackEvent = e.detail;
            }}
            showFeedback={feedbackNode?.data.enable_input}
          />
        {/each}
      </div>
    {/each}
  {/if}
</div>

<!-- Appendix -->
{#if report?.topics}
  <Appendix {dataset} />
{/if}

<!-- Style -->
<style>
  .chart-wrapper.selected {
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.5);
  }
  .graph-container {
    padding: var(--main-padding);
    max-width: 70rem;
    flex: 1;
    display: flex;
    flex-direction: column;
    width: 100%;
    margin: 0 auto;
    box-sizing: border-box;
    display: grid;
    grid-template-columns: var(--grid-template-columns);
    gap: 16px;
    transition: all 0.5s ease-in-out;
  }

  .chart-wrapper {
    flex-grow: 1;
    height: 400px;
    border-radius: 8px;
    overflow: hidden;
    transition: all 0.5s ease-in-out;
  }

  .info-panel {
    width: 400px;
    transition: all 0.5s ease-in-out;
    display: none;
  }

  .info-active .info-panel {
    display: block;
  }
</style>
