import { describe, it, expect, vi, beforeEach } from 'vitest';
import FilterCSVNode, { filter_csv_node_data } from '$lib/compute/filter_csv_v0';
import deepCopy from 'deep-copy';

describe('FilterCSVNode class', () => {
  let node;
  let inputData;

  beforeEach(() => {
    node = new FilterCSVNode(deepCopy(filter_csv_node_data));
    inputData = {
      input: [
        { name: 'Alice', age: 30 },
        { name: 'Bob', age: 25 },
        { name: 'Charlie', age: 35 }
      ]
    };
  });

  it('should filter CSV data inclusively based on provided filters', async () => {
    node.data.filters = [{ column: 'name', value: 'Alice' }];
    node.data.exclusive = false;
    const result = await node.compute(
      inputData,
      'run',
      vi.fn(),
      vi.fn(),
      vi.fn(),
      'test_slug',
      vi.fn()
    );
    expect(result).toEqual([{ name: 'Alice', age: 30 }]);
  });

  it('should filter CSV data exclusively based on provided filters', async () => {
    node.data.filters = [{ column: 'age', value: 30 }];
    node.data.exclusive = true;
    const result = await node.compute(
      inputData,
      'run',
      vi.fn(),
      vi.fn(),
      vi.fn(),
      'test_slug',
      vi.fn()
    );
    expect(result).toEqual([
      { name: 'Bob', age: 25 },
      { name: 'Charlie', age: 35 }
    ]);
  });

  it('should return all data if no filters are set', async () => {
    node.data.filters = [];
    const result = await node.compute(
      inputData,
      'run',
      vi.fn(),
      vi.fn(),
      vi.fn(),
      'test_slug',
      vi.fn()
    );
    expect(result).toEqual(inputData.input);
  });

  it('should handle multiple filters correctly', async () => {
    node.data.filters = [
      { column: 'name', value: 'Alice' },
      { column: 'age', value: 30 }
    ];
    node.data.exclusive = false;
    const result = await node.compute(
      inputData,
      'run',
      vi.fn(),
      vi.fn(),
      vi.fn(),
      'test_slug',
      vi.fn()
    );
    expect(result).toEqual([{ name: 'Alice', age: 30 }]);
  });

  it('should set dirty to false after compute', async () => {
    await node.compute(inputData, 'run', vi.fn(), vi.fn(), vi.fn(), 'test_slug', vi.fn());
    expect(node.data.dirty).toBe(false);
  });

  it('should not mutate the input data', async () => {
    const originalInputData = deepCopy(inputData);
    await node.compute(inputData, 'run', vi.fn(), vi.fn(), vi.fn(), 'test_slug', vi.fn());
    expect(inputData).toEqual(originalInputData);
  });
});
