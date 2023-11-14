<script lang="ts">
	export let dataset;
	let report = dataset.graph.nodes.find((node) => node.id === 'report').data.output;
	console.log(report);
	const { argument_extraction, cluster_extraction } = report;
</script>

{#each cluster_extraction.topics as topic}
	<p>{topic.topicName}</p>
{/each}
