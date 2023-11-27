import type { Node, Edge } from '@xyflow/svelte';
import { DGNode } from '$lib/node';
import type { Writable } from 'svelte/store';
import { writable, get } from 'svelte/store';

export class DependencyGraph {
	nodes: Writable<Node[]>;
	edges: Writable<Edge[]>;

	constructor(nodes: [Node], edges: [Edge]) {
		this.nodes = writable<Node[]>(nodes);
		this.edges = writable<Edge[]>(edges);
	}

	find = (id: string): DGNode => {
		return new DGNode(get(this.nodes).find((node) => node.id === id));
	};

	deleteAssets = () => {
		get(this.nodes).forEach((node) => this.find(node.id).deleteAssets());
	};

	deleteNode = (id: string) => {
		const node = this.find(id);
		node.deleteAssets();
		this.nodes.update(($nodes) => $nodes.filter((node) => node.id !== id));
		this.edges.update(($edges) =>
			$edges.filter((edge) => edge.source !== id && edge.target !== id)
		);
	};
}
