import { describe, it, vi } from 'vitest';
import { expect } from 'vitest';
import LimitCSVNode, { limit_csv_node_data } from '$lib/compute/limit_csv_v0';

describe('limit_csv function', () => {
  it('should let all data pass through if number is left blank', async () => {
    const node = new LimitCSVNode(limit_csv_node_data);
    node.data.number = '';
    const inputData = { csv: [{ name: 'Alice' }, { name: 'Bob' }, { name: 'Charlie' }] };
    const result = await node.compute(
      inputData,
      'run',
      vi.fn(),
      vi.fn(),
      vi.fn(),
      'test_slug',
      vi.fn()
    );
    expect(result).toEqual([{ name: 'Alice' }, { name: 'Bob' }, { name: 'Charlie' }]);
  });

  it('should limit the number of rows correctly, for an object', async () => {
    const node = new LimitCSVNode(limit_csv_node_data);
    node.data.number = '1';
    const inputData = {
      csv: { 1: { name: 'Alice' }, 2: { name: 'Bob' }, 3: { name: 'Charlie' } }
    };
    const result = await node.compute(
      inputData,
      'run',
      vi.fn(),
      vi.fn(),
      vi.fn(),
      'test_slug',
      vi.fn()
    );
    expect(result).toEqual({ 1: { name: 'Alice' } });
  });

  it('should return all rows if limit is greater than number of rows', async () => {
    const node = new LimitCSVNode(limit_csv_node_data);
    node.data.number = '5';
    const inputData = { csv: [{ name: 'Alice' }, { name: 'Bob' }] };
    const result = await node.compute(
      inputData,
      'run',
      vi.fn(),
      vi.fn(),
      vi.fn(),
      'test_slug',
      vi.fn()
    );
    expect(result).toEqual([{ name: 'Alice' }, { name: 'Bob' }]);
  });

  it('should return an empty array if input is empty', async () => {
    const node = new LimitCSVNode(limit_csv_node_data);
    const inputData = { csv: [] };
    const result = await node.compute(
      inputData,
      'run',
      vi.fn(),
      vi.fn(),
      vi.fn(),
      'test_slug',
      vi.fn()
    );
    expect(result).toEqual([]);
  });

  it('should not mutate the input node', async () => {
    const originalNode = new LimitCSVNode(limit_csv_node_data);
    const nodeCopy = new LimitCSVNode(limit_csv_node_data);
    const inputData = { csv: [{ name: 'Alice' }, { name: 'Bob' }, { name: 'Charlie' }] };

    await nodeCopy.compute(inputData, 'run', vi.fn(), vi.fn(), vi.fn(), 'test_slug', vi.fn());

    // Check if dirty flag is updated
    expect(nodeCopy.data.dirty).toBe(false);

    // Ensure other properties remain unchanged
    expect(nodeCopy.id).toEqual(originalNode.id);
    expect(nodeCopy.type).toEqual(originalNode.type);
    expect(nodeCopy.position).toEqual(originalNode.position);
  });
});
