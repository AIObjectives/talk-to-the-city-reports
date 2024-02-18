import { describe, it, vi, beforeEach } from 'vitest';
import { expect } from 'vitest';
import CSVNode, { csv_node_data } from '$lib/compute/csv_v0';
import deepCopy from 'deep-copy';
import * as utils from '$lib/utils';

describe('CSVNode class', () => {
  beforeEach(() => {
    // Reset module mocking before each test
    vi.restoreAllMocks();
  });

  it('should process CSV data correctly from GCS', async () => {
    vi.spyOn(utils, 'readFileFromGCS').mockResolvedValue('name,age\nAlice,30\nBob,');
    const node = new CSVNode({
      id: 'csv',
      data: deepCopy(csv_node_data),
      position: { x: 0, y: 0 },
      type: 'csv_v0'
    });
    node.data.gcs_path = 'path/to/file.csv';
    const result = await node.compute();
    expect(result).toEqual([
      { name: 'Alice', age: '30' },
      { name: 'Bob', age: '' }
    ]);
    expect(node.data.dirty).toBe(false);
  });
});
