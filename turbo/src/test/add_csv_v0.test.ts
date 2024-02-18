import { describe, it, expect, vi, beforeEach } from 'vitest';
import AddCSVNode, { add_csv_node_data } from '$lib/compute/add_csv_v0';
import deepCopy from 'deep-copy';

describe('AddCSVNode class', () => {
  let node;
  let inputData;
  let outputData;

  beforeEach(() => {
    node = new AddCSVNode(deepCopy(add_csv_node_data));
    inputData = {
      input_1: [{ name: 'Alice', age: 30 }],
      input_2: [{ name: 'Bob', age: 25 }]
    };
    outputData = [
      { name: 'Alice', age: 30 },
      { name: 'Bob', age: 25 }
    ];
  });

  it('should concatenate multiple CSV inputs into a single output array', async () => {
    const result = await node.compute(
      inputData,
      'run',
      vi.fn(),
      vi.fn(),
      vi.fn(),
      'test_slug',
      vi.fn()
    );
    expect(result).toEqual(outputData);
    expect(node.data.output).toEqual(outputData);
  });

  it('should handle empty input arrays', async () => {
    inputData = {
      input_1: [],
      input_2: []
    };
    outputData = [];
    const result = await node.compute(
      inputData,
      'run',
      vi.fn(),
      vi.fn(),
      vi.fn(),
      'test_slug',
      vi.fn()
    );
    expect(result).toEqual(outputData);
    expect(node.data.output).toEqual(outputData);
  });

  it('should handle a single input array', async () => {
    inputData = {
      input_1: [{ name: 'Charlie', age: 40 }]
    };
    outputData = [{ name: 'Charlie', age: 40 }];
    const result = await node.compute(
      inputData,
      'run',
      vi.fn(),
      vi.fn(),
      vi.fn(),
      'test_slug',
      vi.fn()
    );
    expect(result).toEqual(outputData);
    expect(node.data.output).toEqual(outputData);
  });

  it('should set dirty to false after compute', async () => {
    await node.compute(inputData, 'run', vi.fn(), vi.fn(), vi.fn(), 'test_slug', vi.fn());
    expect(node.data.dirty).toBe(false);
  });

  it('should return an empty array if no inputs are provided', async () => {
    inputData = {};
    outputData = [];
    const result = await node.compute(
      inputData,
      'run',
      vi.fn(),
      vi.fn(),
      vi.fn(),
      'test_slug',
      vi.fn()
    );
    expect(result).toEqual(outputData);
    expect(node.data.output).toEqual(outputData);
  });

  it('should not mutate the input data', async () => {
    const originalInputData = deepCopy(inputData);
    await node.compute(inputData, 'run', vi.fn(), vi.fn(), vi.fn(), 'test_slug', vi.fn());
    expect(inputData).toEqual(originalInputData);
  });
});
