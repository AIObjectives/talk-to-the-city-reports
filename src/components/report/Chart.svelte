<script>
	import { onMount } from 'svelte';
	import { Chart, Svg, Group, Pack, Zoom } from 'layerchart';
	import { cubicOut } from 'svelte/easing';
	import ChartText from './ChartText.svelte';
	import ChartCircle from './ChartCircle.svelte';

	export let complexHierarchy;
	export let getNodeColor;
	export let onSelect;
	let padding = 3;
	let colorBy = 'parent';

	let zoom;
	let selected;

	onMount(() => {
		selected = complexHierarchy;
	});

	$: selected = complexHierarchy;

	$: if (zoom && selected) {
		if (selected.x != undefined && selected.y != undefined) {
			const diameter = selected.r * 2;
			zoom.zoomTo({ x: selected.x, y: selected.y }, { width: diameter, height: diameter });
		}
	}
</script>

<Chart data={complexHierarchy}>
	<Svg>
		<Zoom
			bind:this={zoom}
			let:scale
			tweened={{ duration: 800, easing: cubicOut }}
			disablePointer
			on:click={() => (selected = complexHierarchy)}
		>
			<Pack {padding} let:nodes>
				{#each nodes.filter((node) => node.depth <= (selected ? selected.depth + 1 : 1)) as node (node.data.name + '-' + node.depth + '-' + node.x + '-' + node.y)}
					<Group
						x={node.x}
						y={node.y}
						on:click={(e) => {
							e.stopPropagation();
							selected = node;
						}}
						class="cursor-pointer hover:contrast-[1.2]"
					>
						<ChartCircle
							{node}
							{colorBy}
							{scale}
							{getNodeColor}
							on:mouseenter
							on:mouseleave
							on:click
						/>
					</Group>
				{/each}
				{#each selected ? selected.children ?? [selected] : [] as node (node.data.name + '-' + node.depth + '-' + node.x + '-' + node.y)}
					{#if node.depth < 3 || (node.depth == 3 && node.parent.children.length <= 5)}
						<ChartText {node} {scale} />
					{/if}
				{/each}
			</Pack>
		</Zoom>
	</Svg>
</Chart>
