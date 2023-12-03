import type { Node, Edge } from '@xyflow/svelte';
import { DGNode } from '$lib/node';
import type { Writable } from 'svelte/store';
import { writable, get } from 'svelte/store';

export class DependencyGraph {
	nodes: Writable<Node[]>;
	edges: Writable<Edge[]>;
	parent: any; // dataset

	constructor(nodes: [Node], edges: [Edge], parent: any) {
		this.nodes = writable<Node[]>(nodes);
		this.edges = writable<Edge[]>(edges);
		this.parent = parent;
	}

	find = (id: string): DGNode => {
		const node = get(this.nodes).find((node) => node.id === id);
		if (node) return new DGNode(node, this);
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

	onConnect = (source: string, target: string) => {
		source = get(this.nodes).find((n) => n.id === source);
		target = get(this.nodes).find((n) => n.id === target);
		target.data.dirty = true;
		setTimeout(() => {
			this.nodes.update(($nodes) => $nodes);
			for (const node of get(this.nodes)) {
				node.data = { ...node.data };
			}
		}, 500);
	};
}
