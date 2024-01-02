import { tick } from 'svelte';
import type { Node, Edge } from '@xyflow/svelte';
import { DGNode } from '$lib/node';
import deepCopy from 'deep-copy';
import type { Writable } from 'svelte/store';
import { writable, get } from 'svelte/store';

export class DependencyGraph {
	nodes: Writable<Node[]>;
	edges: Writable<Edge[]>;
	parent: any; // dataset

	constructor(nodes: [Node], edges: [Edge], parent: any) {
		this.nodes = writable<Node[]>(nodes ? nodes : []);
		this.edges = writable<Edge[]>(edges ? edges : []);
		this.parent = parent;
	}

	findByComputeType = (computeType: string): DGNode[] => {
		const nodes = get(this.nodes).filter((node) => node.data.compute_type === computeType);
		return nodes.map((node) => new DGNode(node, this));
	};

	find = (id: string): DGNode => {
		const node = get(this.nodes).find((node) => node.id === id);
		if (node) return new DGNode(node, this);
	};

	duplicateSelectedNodes = () => {
		const selectedNodes = get(this.nodes).filter((node) => node.selected);
		const oldToNewIdMap = new Map();
		const newNodes = selectedNodes.map((node) => {
			const newNode = deepCopy(node);
			const nodeNameParts = node.id.split('_');
			const nodeName = nodeNameParts.slice(0, -1).join('_');
			const newId = `${nodeName}_${Math.floor(Math.random() * 1000000)}`; // Generate a random number between 0 and 999999
			newNode.id = newId;
			newNode.position.x += 1000;
			newNode.selected = false;
			oldToNewIdMap.set(node.id, newNode.id);
			return newNode;
		});

		const newEdges = get(this.edges)
			.map((edge) => {
				const sourceIsSelected = oldToNewIdMap.has(edge.source);
				const targetIsSelected = oldToNewIdMap.has(edge.target);
				if (sourceIsSelected || targetIsSelected) {
					const newEdge = deepCopy(edge);
					newEdge.id = Math.random().toString(36).substring(7);
					if (sourceIsSelected) {
						newEdge.source = oldToNewIdMap.get(edge.source);
					}
					if (targetIsSelected) {
						newEdge.target = oldToNewIdMap.get(edge.target);
					}
					return newEdge;
				}
				return undefined;
			})
			.filter((edge) => edge !== undefined);
		this.nodes.update(($nodes) => [...$nodes, ...newNodes]);
		this.edges.update(($edges) => [...$edges, ...newEdges]);
	};

	listAssets = () => {
		let assets: string[] = [];
		get(this.nodes).forEach((node) => {
			const asset = this.find(node.id).node.data.gcs_path;
			if (asset) assets.push(asset);
		});
		return assets;
	};

	deleteAssets = () => {
		get(this.nodes).forEach((node) => this.find(node.id).deleteAssets());
	};

	async copyAssets() {
		const copyOperations = get(this.nodes).map(async (node) => {
			await this.find(node.id).copyAssets();
		});
		await Promise.all(copyOperations);
		await tick();
		this.nodes.update((nodes) => [...nodes]);
	}

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
