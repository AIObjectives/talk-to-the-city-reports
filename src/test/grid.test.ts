import { grid, grid_node } from '$lib/compute/grid';
import deepCopy from 'deep-copy';
import { describe, it } from 'vitest';
import { expect } from 'vitest';

describe('grid', () => {
	it('sets the output of the node to the input data', async () => {
		const node = deepCopy(grid_node);
		const inputData = { json: { key: 'value' } };
		await grid(node, inputData, null);
		expect(node.data.output).toEqual({ key: 'value' });
	});

	it('sets the dirty property of the node to false', async () => {
		const node = deepCopy(grid_node);
		node.data.dirty = true;
		const inputData = { json: { key: 'value' } };
		await grid(node, inputData, null);
		expect(node.data.dirty).toEqual(false);
	});

	it('handles array input data', async () => {
		const node = deepCopy(grid_node);
		const inputData = { json: ['value1', 'value2'] };
		await grid(node, inputData, null);
		expect(node.data.output).toEqual(['value1', 'value2']);
	});

	it('handles empty input data', async () => {
		const node = deepCopy(grid_node);
		const inputData = { json: {} };
		await grid(node, inputData, null);
		expect(node.data.output).toEqual({});
	});
});
