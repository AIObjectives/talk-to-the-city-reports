<script lang="ts">
	import { get } from 'svelte/store';
	import { findAncestor } from '$lib/hierarchy';
	import { hierarchy } from 'd3-hierarchy';
	import { scaleOrdinal } from 'd3-scale';
	import Paper from '@smui/paper';
	import { hsl } from 'd3-color';
	import { sortFunc } from 'svelte-ux';
	import Chart from '$components/report/Chart.svelte';
	import Claims from '$components/report/Claims.svelte';
	import Tooltip from '$components/report/Tooltip.svelte';
	import InfoPanel from '$components/report/InfoPanel.svelte';
	export let dataset: any;

	let report: any;
	let csv: any;

	function transformData(originalData) {
		const transformed = {
			name: 'heal michigan',
			children: []
		};
		originalData.topics.forEach((topic) => {
			const topicEntry = {
				name: topic.topicName,
				children: []
			};
			topic.subtopics.forEach((subtopic) => {
				const claims = subtopic.claims.map((claim) => {
					return {
						name: claim.claim,
						claim: claim,
						value: 1
					};
				});
				const subtopicEntry = {
					name: subtopic.subtopicName
				};
				if (claims.length > 0) {
					subtopicEntry.children = claims;
				} else {
					subtopicEntry.value = 1;
				}
				topicEntry.children.push(subtopicEntry);
			});
			transformed.children.push(topicEntry);
		});
		return transformed;
	}

	let complexHierarchy: any;

	$: {
		if (dataset) {
			let report_node = get(dataset.graph.nodes).find((n) => n.type === 'report_v0');
			let csv_node = get(dataset.graph.nodes).find((n) => n.type === 'csv_v0');
			if (report_node && report_node.data && csv_node && csv_node.data) {
				report = report_node.data.output;
				csv = csv_node.data.output;
				if (csv && report && report.topics && report.topics.length > 0) {
					let transformedData = transformData(report);
					complexHierarchy = hierarchy(transformedData)
						.sum((d) => d.value)
						.sort(sortFunc('value', 'desc'));
				}
			}
		}
	}

	let tooltipEvent: any;
	let clickEvent: any;

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
</script>

<div class="graph-container">
	{#if complexHierarchy}
		<Tooltip {tooltipEvent} />
		<div style="display: grid; grid-template-columns: 1fr 1fr;">
			<div class="h-[400px] p-4 rounded overflow-hidden">
				<Chart
					{complexHierarchy}
					{getNodeColor}
					on:click={(e) => (clickEvent = e.detail)}
					on:mouseenter={(e) => (tooltipEvent = e.detail)}
					on:mouseleave={(e) => (tooltipEvent = null)}
				/>
			</div>
			<InfoPanel {clickEvent} {csv} />
		</div>
	{/if}
</div>
<br />

<div class="report-container">
	{#if report && report.topics}
		{#each report.topics as topic}
			<Paper square>
				<div class="p-4 rounded">
					<h2
						class="text-2xl font-bold"
						style="color: {hsl(ordinalColor(topic.topicName)).brighter(-1)}"
					>
						{topic.topicName}
					</h2>

					<h3 class="mt-4 mb-4">{topic.topicShortDescription}</h3>
					{#each topic.subtopics as subtopic}
						<Paper square>
							<div class="ml-3 items-center justify-between">
								<div class="flex items-center mt-1">
									<div class="w-1 h-1 mr-2 rounded-full" style="background-color: #bbbbff" />
									<div class="text-lg" style="color: #555">{subtopic.subtopicName}</div>
								</div>
								<div class="ml-5 mt-2 mb-2" style="color: black">
									<h3>{subtopic.subtopicShortDescription}</h3>
								</div>
								<Claims claims={subtopic.claims} />
							</div>
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
</style>
