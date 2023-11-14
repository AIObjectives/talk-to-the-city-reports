import { get } from 'svelte/store';

export function topologicalSort(nodes, edges) {
	let sorted = [];
	let visited = {};
	let graph = {};

	// Initialize the graph
	nodes.forEach((node) => {
		graph[node.id] = { id: node.id, edges: [] };
		visited[node.id] = false;
	});

	// Map the edges to the graph
	get(edges).forEach((edge) => {
		graph[edge.source].edges.push(edge.target);
	});

	// DFS to sort the graph
	function visit(node) {
		if (visited[node]) return;
		visited[node] = true;

		graph[node].edges.forEach((neighbor) => visit(neighbor));

		sorted.push(node);
	}

	nodes.forEach((node) => visit(node.id));

	return sorted.reverse();
}
