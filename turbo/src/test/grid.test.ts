import { describe, it, vi, beforeEach } from 'vitest';
import { expect } from 'vitest';
import GridNode, { grid_node_data } from '$lib/compute/grid_v0';
import deepCopy from 'deep-copy';

describe('GridNode class', () => {
  beforeEach(() => {
    // Reset module mocking before each test
    vi.restoreAllMocks();
  });

  it('sets the output of the node to the input data', async () => {
    const node = new GridNode({
      id: 'grid',
      data: deepCopy(grid_node_data),
      position: { x: 0, y: 0 },
      type: 'grid_v0'
    });
    const inputData = { json: ['a', 'b'] };
    const result = await node.compute(inputData);
    expect(result).toEqual(['a', 'b']);
    expect(node.data.dirty).toBe(false);
  });
});
