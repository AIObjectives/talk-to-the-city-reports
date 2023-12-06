import { describe, it } from 'vitest';
import { expect } from 'vitest';
import GridNode, { grid_node_data } from '$lib/compute/grid';
import nodes from '$lib/node_register';

describe('Register class', () => {
	it('test node registeration', async () => {
		nodes.register(GridNode, grid_node_data);
		console.log(nodes.nodes);
		expect(nodes.nodes).toEqual({ grid_v0: GridNode });
	});
});
