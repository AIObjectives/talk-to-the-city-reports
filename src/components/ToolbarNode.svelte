<script lang="ts">
	import { fade } from 'svelte/transition';
	export let node;
	const onDragStart = (event: DragEvent, nodeType: string) => {
		if (!event.dataTransfer) return null;
		event.dataTransfer.setData('application/svelteflow', nodeType);
		event.dataTransfer.effectAllowed = 'move';
	};

	let showTooltip = false;
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<div
	class="node"
	style="display: inline-block; margin: 5px; padding: 5px; border: 1px solid #ccc; border-radius: 5px; cursor: pointer; position: relative;"
	on:mouseover={() => (showTooltip = true)}
	on:mouseout={() => (showTooltip = false)}
>
	<!-- svelte-ignore missing-declaration -->
	<div
		style="width: 30px; height: 30px; overflow: hidden;"
		title={node.data.label}
		draggable={true}
		on:dragstart={(event) => onDragStart(event, node.id)}
	>
		<!-- svelte-ignore a11y-missing-attribute -->
		<img
			src="https://talktothecity.s3.us-west-1.amazonaws.com/tttc-turbo/static/{node.data.icon}.png"
			style="width: 100%; height: 100%; object-fit: contain;"
		/>
	</div>
	{#if showTooltip}
		<div
			style="position: absolute; bottom: 100%; left: 50%; transform: translateX(-50%); background: #333; color: #fff; padding: 5px; border-radius: 5px;"
		>
			{node.data.label}
		</div>
	{/if}
</div>
