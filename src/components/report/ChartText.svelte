<script>
	export let node;
	export let scale = 1;
	import { fade } from 'svelte/transition';

	function splitToLines(text, width) {
		const words = text.split(' ');
		let lines = [];
		let currentLine = words[0];

		for (let i = 1; i < words.length; i++) {
			if (currentLine.length + words[i].length + 1 > width) {
				lines.push(currentLine);
				currentLine = words[i];
			} else {
				currentLine += ' ' + words[i];
			}
		}
		lines.push(currentLine);

		return lines;
	}
	// Make fontSize reactive and dependent on scale
	$: fontSize = scale > 0 ? 0.9 / scale : 0.9;

	// Now other reactive statements that depend on fontSize
	$: lineHeight = fontSize * 20;
	$: textBlockHeight = lines.length * lineHeight;
	$: yPosition = lines.length > 1 ? node.y - textBlockHeight / 2.5 : node.y;

	let text = node.data.name;
	if (node.children) {
		text = node.data.name + ' (' + node.children.length + ')';
	}
	let lines = splitToLines(text, 20);
</script>

<g in:fade|local>
	<text
		x={node.x}
		y={yPosition}
		class="stroke-white/70 pointer-events-none [text-anchor:middle] [paint-order:stroke]"
		style:font-size="{fontSize}rem"
		style:stroke-width="{fontSize * 2}px"
	>
		{#each lines as line, index (line)}
			<tspan x={node.x} dy={index > 0 ? lineHeight : 0}>{line}</tspan>
		{/each}
	</text>
</g>
