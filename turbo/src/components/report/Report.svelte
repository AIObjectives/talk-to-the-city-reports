<script lang="ts">
	import _ from 'lodash';
	import { get } from 'svelte/store';
	import { findAncestor } from '$lib/hierarchy';
	import { hierarchy } from 'd3-hierarchy';
	import { scaleOrdinal } from 'd3-scale';
	import Paper from '@smui/paper';
	import { _ as __ } from 'svelte-i18n';
	import { hsl } from 'd3-color';
	import { sortFunc } from 'svelte-ux';
	import Chart from '$components/report/Chart.svelte';
	import Claims from '$components/report/Claims.svelte';
	import Tooltip from '$components/report/Tooltip.svelte';
	import InfoPanel from '$components/report/InfoPanel.svelte';
	import FeedbackDialog from './FeedbackDialog.svelte';

	export let dataset: any;

	let report: any;
	let csv: any;
	let timestamps;

	function transformData(originalData) {
		return {
			name: '',
			children: _.map(originalData.topics, (topic) => ({
				name: topic.topicName,
				children: _.map(topic.subtopics, (subtopic) => {
					const groupedClaims = _.groupBy(subtopic.claims, 'claim');
					const claims = _.map(groupedClaims, (claimGroup, claimName) => ({
						name: claimName,
						claims: claimGroup,
						value: claimGroup.length
					}));
					return {
						name: subtopic.subtopicName,
						...(claims.length > 0 ? { children: claims } : { value: 1 })
					};
				})
			}))
		};
	}

	let complexHierarchy: any;

	let report_node;
	let csv_node;
	let feedbackNode;

	$: {
		if (dataset) {
			const report_node_v0 = get(dataset.graph.nodes).find(
				(n) => n.data?.compute_type === 'report_v0'
			);
			const report_node_v1 = get(dataset.graph.nodes).find(
				(n) => n.data?.compute_type === 'report_v1'
			);
			if (report_node_v0) {
				csv_node =
					get(dataset.graph.nodes).find((n) => n.data?.compute_type === 'csv_v0') ||
					get(dataset.graph.nodes).find((n) => n.data?.compute_type === 'json_v0');
				report_node = report_node_v0;
				report = report_node.data.output;
				csv = csv_node.data.output;
			} else if (report_node_v1) {
				csv = report_node_v1.data.output[report_node_v1.data.output_ids.csv];
				report = report_node_v1.data.output[report_node_v1.data.output_ids.merge];
				timestamps = report_node_v1.data.output[report_node_v1.data.output_ids.timestamps];
				if (!_.isEmpty(timestamps))
					timestamps = _.map(timestamps, (item) => {
						const parts = item.timestamp.split(':').map(Number);
						const totalSeconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
						return _.assign(item, { timestamp_seconds: totalSeconds });
					});
			}

			feedbackNode = get(dataset.graph.nodes).find((n) => n.data?.compute_type === 'feedback_v0');
			if (!_.isEmpty(report) && !_.isEmpty(csv)) {
				if (!_.isEmpty(csv) && _.every(csv, (item) => item.timestamp))
					csv = _.map(csv, (item) => {
						if (item.timestamp) {
							const parts = item.timestamp.split(':').map(Number);
							const totalSeconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
							return _.assign(item, { timestamp_seconds: totalSeconds });
						}
					});

				let transformedData = transformData(report);
				complexHierarchy = hierarchy(transformedData)
					.sum((d) => d.value)
					.sort(sortFunc('value', 'desc'));
			}
		}
	}

	let tooltipEvent: any;
	let clickEvent: any;
	let feedbackEvent: any;

	const customColors = [
		'#005F73',
		'#0A9396',
		'#94D2BD',
		'#E9D8A6',
		'#EE9B00',
		'#CA6702',
		'#BB3E03',
		'#AE2012',
		'#9B2226'
	];

	const ordinalColor = scaleOrdinal(customColors);

	function getNodeColor(node) {
		const colorParent = findAncestor(node, (n) => n.depth === 1);
		return colorParent
			? hsl(ordinalColor(colorParent.data.name)).brighter(node.depth * 0.3)
			: '#ddd';
	}

	let showInfoPanel = false;
	$: gridTemplateColumns = showInfoPanel ? '1fr 400px' : '1fr';
	let selected;

</script>

<FeedbackDialog {dataset} claims={feedbackEvent} />

<div class="graph-container" class:info-active={showInfoPanel} style="--grid-template-columns: {gridTemplateColumns}">
    {#if complexHierarchy}
        <Tooltip {tooltipEvent} />
        <div class="chart-wrapper" class:selected={selected?.depth > 1}>
            <Chart
                {complexHierarchy}
                {getNodeColor}
                bind:selected="{selected}"
                on:click={(e) => {
                    if (e?.detail?.node){
                        tooltipEvent = null;
                        clickEvent = e.detail;
                    }
                    showInfoPanel = !!e?.detail?.node;
                }}
                on:mouseenter={(e) => (tooltipEvent = e.detail)}
                on:mouseleave={(e) => (tooltipEvent = null)}
            />
        </div>
        {#if showInfoPanel}
            <div class="info-panel">
                <InfoPanel
                    scrollHeight={'400px'}
                    showFeedback={!!feedbackNode}
                    {dataset}
                    {clickEvent}
                    {csv}
                    {timestamps}
                    on:feedback={(e) => {
                        feedbackEvent = e.detail;
                    }}
                />
            </div>
        {/if}
    {/if}
</div>


<br />

<div class="report-container">
	{#if report && report.topics}
		{#each report.topics as topic}
			<Paper square>
				<div class="p-4 rounded">
					<div style="display: flex; justify-content: space-between; align-items: center;">
						<h3
							class="text-2xl font-bold"
							style="color: {hsl(ordinalColor(topic.topicName)).brighter(-1)}"
						>
							{topic.topicName}
						</h3>
						<small style="color: {hsl(ordinalColor(topic.topicName)).brighter(-2)}">
							{_.map(topic.subtopics.length.toString(), (c) => $__(c)).join('')}
							{$__('subtopics')}
							{_.map(
								_.sumBy(
									topic.subtopics,
									(subtopic) => _.uniqBy(subtopic.claims, 'claim').length
								).toString(),
								(c) => $__(c)
							).join('')}
							{$__('claims')}
						</small>
					</div>

					<h6 class="mt-4 mb-4">{topic.topicShortDescription}</h6>
					{#each topic.subtopics as subtopic}
						<Paper square>
							<div
								class="text-lg"
								style="color: #555; display: flex; justify-content: space-between; align-items: center;"
							>
								<h5>{subtopic.subtopicName}</h5>
								<small>
									{_.map(_.uniqBy(subtopic.claims, 'claim').length.toString(), (c) => $__(c)).join(
										''
									)}
									{$__('claims')}</small
								>
							</div>
							<div class="ml-5 mt-2 mb-2" style="color: black">
								<h7>{subtopic.subtopicShortDescription}</h7>
							</div>
							<Claims
								{dataset}
								{csv}
								claims={subtopic.claims}
								on:feedback={(e) => {
									feedbackEvent = e.detail;
								}}
								showFeedback={!!feedbackNode}
							/>
						</Paper>
						<br />
					{/each}
				</div>
			</Paper>
			<br />
		{/each}
	{/if}
</div>

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
	}
	.report-container {
		padding: var(--main-padding);
		max-width: 50rem;
		flex: 1;
		display: flex;
		flex-direction: column;
		width: 100%;
		margin: 0 auto;
		box-sizing: border-box;
	}
    .graph-container {
        display: grid;
        /* Use the reactive gridTemplateColumns variable */
        grid-template-columns: var(--grid-template-columns);
        gap: 16px; /* Optional: Add a gap if needed */
        transition: all 0.5s ease-in-out; /* Smooth transition for the resizing */
    }

    .chart-wrapper {
        /* Flex-grow allows the chart to grow and take up available space */
        flex-grow: 1;
        height: 400px;
        border-radius: 8px; /* Optional rounded corners */
        overflow: hidden;
        transition: all 0.5s ease-in-out;
    }

    .info-panel {
        /* The InfoPanel takes up one grid column with a fixed width when visible */
        width: 400px;
        transition: all 0.5s ease-in-out;
        /* Set to only take space when it's actually displayed */
        display: none;
    }
    
    /* Only display the info panel when showInfoPanel is true */
    .info-active .info-panel {
        display: block;
    }
</style>
