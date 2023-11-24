export function topologicalSort(nodes, edges) {
	let sorted = [];
	let visited = {};
	let graph = {};

	// Initialize the graph
	nodes.forEach((node) => {
		graph[node.id] = { node: node, edges: [] };
		visited[node.id] = false;
	});

	// Map the edges to the graph
	edges.forEach((edge) => {
		if (graph[edge.source]) {
			graph[edge.source].edges.push(edge.target);
		}
	});

	// DFS to sort the graph
	function visit(nodeId) {
		if (visited[nodeId]) return;
		visited[nodeId] = true;

		graph[nodeId].edges.forEach((neighbor) => visit(neighbor));

		// Push the actual node instead of node ID
		sorted.push(graph[nodeId].node);
	}

	nodes.forEach((node) => visit(node.id));

	return sorted.reverse();
}
