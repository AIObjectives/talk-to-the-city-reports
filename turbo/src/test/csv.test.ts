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
    const node = new CSVNode(deepCopy(csv_node_data));
    node.data.gcs_path = 'path/to/file.csv';
    const result = await node.compute(null, null, vi.fn(), vi.fn(), vi.fn(), 'test_slug', vi.fn());
    expect(result).toEqual([
      { name: 'Alice', age: '30' },
      { name: 'Bob', age: '' }
    ]);
    expect(node.data.dirty).toBe(false);
  });

  it('should handle empty CSV data from GCS', async () => {
    vi.spyOn(utils, 'readFileFromGCS').mockResolvedValue('');
    const node = new CSVNode(deepCopy(csv_node_data));
    node.data.gcs_path = 'path/to/file.csv';
    const result = await node.compute(null, null, vi.fn(), vi.fn(), vi.fn(), 'test_slug', vi.fn());
    expect(result).toEqual([]);
    expect(node.data.dirty).toBe(false);
  });

  it('should handle rows with uneven columns from GCS', async () => {
    vi.spyOn(utils, 'readFileFromGCS').mockResolvedValue('name,age\nAlice,30\nBob');
    const node = new CSVNode(deepCopy(csv_node_data));
    node.data.gcs_path = 'path/to/file.csv';
    const result = await node.compute(null, null, vi.fn(), vi.fn(), vi.fn(), 'test_slug', vi.fn());
    expect(result).toEqual([{ name: 'Alice', age: '30' }, { name: 'Bob' }]);
    expect(node.data.dirty).toBe(false);
  });
});
