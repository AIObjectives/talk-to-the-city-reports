import { describe, it, expect, beforeEach } from 'vitest';
import UniqueNode, { unique_node_data } from '$lib/compute/unique_v0';
import deepCopy from 'deep-copy';

describe('UniqueNode class', () => {
  let node;
  let inputData;

  beforeEach(() => {
    node = new UniqueNode(deepCopy(unique_node_data));
    inputData = {
      input: [
        { key: 'value1' },
        { key: 'value1' },
        { key: 'value2' },
        { key: 'value3' },
        { key: 'value3' }
      ]
    };
    node.data.text = 'key';
  });

  it('should return unique values based on the specified property', async () => {
    const output = await node.compute(
      inputData,
      'run',
      console.log,
      console.error,
      console.log,
      'test_slug'
    );
    expect(output).toEqual(['value1', 'value2', 'value3']);
  });

  it('should return an empty array if input is empty', async () => {
    inputData.input = [];
    const output = await node.compute(
      inputData,
      'run',
      console.log,
      console.error,
      console.log,
      'test_slug'
    );
    expect(output).toEqual([]);
  });

  it('should return undefined if no property is specified', async () => {
    node.data.text = '';
    const output = await node.compute(
      inputData,
      'run',
      console.log,
      console.error,
      console.log,
      'test_slug'
    );
    expect(output).toBeUndefined();
  });

  it('should set dirty to false after compute', async () => {
    await node.compute(inputData, 'run', console.log, console.error, console.log, 'test_slug');
    expect(node.data.dirty).toBe(false);
  });

  it('should not mutate the input data', async () => {
    const originalInputData = deepCopy(inputData);
    await node.compute(inputData, 'run', console.log, console.error, console.log, 'test_slug');
    expect(inputData).toEqual(originalInputData);
  });
});
