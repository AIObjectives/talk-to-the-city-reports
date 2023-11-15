<script>
	import { Circle } from 'layerchart';
	import { hsl } from 'd3-color';
	import { createEventDispatcher } from 'svelte';

	export let node;
	export let colorBy;
	export let scale;
	export let getNodeColor;

	const dispatch = createEventDispatcher();

	let nodeColor = getNodeColor(node, colorBy);
</script>

<Circle
	r={node.r}
	stroke={hsl(nodeColor).darker(colorBy === 'children' ? 0.5 : 1)}
	stroke-width={1 / scale}
	fill={nodeColor}
	rx={5}
	on:mousemove={(e) => {
		e.stopPropagation();
		if (node.depth == 3) {
			dispatch('mouseenter', { event: 'mouseenter', x: e.clientX, y: e.clientY, node });
		}
	}}
	on:mouseleave={(e) => {
		e.stopPropagation();
		if (node.depth == 3) {
			dispatch('mouseleave', { event: 'mouseleave', x: e.clientX, y: e.clientY, node });
		}
	}}
	on:click={(e) => {
		if (node.depth == 3) {
			e.stopPropagation();
			dispatch('click', { event: 'click', x: e.clientX, y: e.clientY, node });
		}
	}}
/>
