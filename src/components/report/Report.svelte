<script lang="ts">
	import { onMount } from 'svelte';
	import { hierarchy } from 'd3-hierarchy';
	import { scaleSequential, scaleOrdinal } from 'd3-scale';
	import * as chromatic from 'd3-scale-chromatic';
	import Paper from '@smui/paper';
	import { hsl } from 'd3-color';
	import { format, sortFunc } from 'svelte-ux';
	import Breadcrumbs from '$components/report/Breadcrumbs.svelte';
	import Chart from '$components/report/Chart.svelte';
	import Claims from '$components/report/Claims.svelte';
	import Tooltip from '$components/report/Tooltip.svelte';
	import InfoPanel from '$components/report/InfoPanel.svelte';
	// import { complexData } from '$components/hierarchy';
	export let dataset;

	import { findAncestor } from '$lib/hierarchy';

	$: argument_extraction = dataset.graph.nodes.find((node) => node.id === 'argument_extraction')
		.data.output;
	$: cluster_extraction = dataset.graph.nodes.find((node) => node.id === 'cluster_extraction').data
		.output;
	$: report = { argument_extraction, cluster_extraction };
	$: csv = dataset.graph.nodes.find((node) => node.id === 'csv').data.output;

	function getClaimsForTopic(data, topicName, subtopicName) {
		let claims = [];
		for (const key in data.argument_extraction) {
			const extraction = data.argument_extraction[key];

			extraction.claims.forEach((claim) => {
				if (claim.topicName === topicName && claim.subtopicName === subtopicName) {
					claim.interview = extraction.interview;
					claim.id = extraction.id;
					claims.push(claim);
				}
			});
		}
		return claims;
	}

	function transformData(data) {
		const result = {
			name: 'heal michigan',
			children: []
		};
		data.cluster_extraction.topics.forEach((topic) => {
			const topicObj = {
				name: topic.topicName,
				children: []
			};

			topic.subtopics.forEach((subtopic) => {
				let claims = getClaimsForTopic(data, topic.topicName, subtopic.subtopicName);
				topicObj.children.push({
					name: subtopic.subtopicName,
					children: claims.map((claim) => {
						return {
							name: claim.claim,
							claim: claim,
							value: 1
						};
					})
				});
			});
			result.children.push(topicObj);
		});
		return result;
	}

	let complexHierarchy;

	$: {
		if (cluster_extraction.topics) {
			let transformedData = transformData(report);
			complexHierarchy = hierarchy(transformedData)
				.sum((d) => d.value)
				.sort(sortFunc('value', 'desc'));
		}
	}

	let selected;
	let zoom;
	let tooltipEvent;
	let clickEvent;

	$: if (zoom && selected) {
		const diameter = selected.r * 2;
		zoom.zoomTo({ x: selected.x, y: selected.y }, { width: diameter, height: diameter });
	}

	const sequentialColor = scaleSequential([4, -1], chromatic.interpolateGnBu);
	const ordinalColor = scaleOrdinal(
		chromatic.schemeSpectral[9].filter((c) => hsl(c).h < 60 || hsl(c).h > 90)
	);

	function getNodeColor(node, colorBy) {
		switch (colorBy) {
			case 'children':
				return node.children ? '#ccc' : '#ddd';
			case 'depth':
				return sequentialColor(node.depth);
			case 'parent':
				const colorParent = findAncestor(node, (n) => n.depth === 1);
				return colorParent
					? hsl(ordinalColor(colorParent.data.name)).brighter(node.depth * 0.3)
					: '#ddd';
		}
	}

	onMount(() => {
		selected = complexHierarchy;
	});
	console.log(report);
</script>

{#if complexHierarchy}
	<Breadcrumbs {selected} {format} onSelect={(item) => (selected = item)} />
	<Tooltip {tooltipEvent} />
	<div style="display: grid; grid-template-columns: 1fr 1fr;">
		<div class="h-[400px] p-4 rounded overflow-hidden">
			<Chart
				{complexHierarchy}
				{getNodeColor}
				onSelect={(node) => (selected = node)}
				on:click={(e) => (clickEvent = e.detail)}
				on:mouseenter={(e) => (tooltipEvent = e.detail)}
				on:mouseleave={(e) => (tooltipEvent = null)}
			/>
		</div>
		<InfoPanel {clickEvent} {csv} />
	</div>
{/if}
<br />

{#if cluster_extraction.topics}
	{#each report.cluster_extraction.topics as topic}
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
							<Claims {report} {topic} {subtopic} {getClaimsForTopic} />
						</div>
					</Paper>
					<br />
				{/each}
			</div>
		</Paper>
		<br />
	{/each}
{/if}
