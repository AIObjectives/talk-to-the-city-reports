import { grid, grid_node } from '$lib/compute/grid';
import { describe, it, expect } from 'vitest';
import deepCopy from 'deep-copy';
import cluster_extraction from '$lib/mock_data/cluster_extraction/cluster_extraction.json';

describe('grid', () => {
	// it('sets the output of the node to the input data', async () => {
	// 	const node = deepCopy(grid_node);
	// 	const inputData = { json: ['a', 'b'] };
	// 	await grid(node, inputData, null);
	// 	expect(node.data.output).toEqual(['a', 'b']);
	// });
	// it('when input is an object with a single key/value, use that', async () => {
	// 	const node = deepCopy(grid_node);
	// 	const inputData = { json: { a: 'b' } };
	// 	await grid(node, inputData, null);
	// 	expect(node.data.output).toEqual(['b']);
	// });
	it('when input is an object with a single key/value, use that', async () => {
		const node = deepCopy(grid_node);
		const inputData = { json: cluster_extraction };
		// await grid(node, inputData, null);
		// console.log(node.data.output);
		// expect(node.data.output).toEqual(inputData.json);
	});
});
