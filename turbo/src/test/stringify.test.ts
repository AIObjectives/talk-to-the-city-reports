import StringifyNode, { stringify_node_data } from '$lib/compute/stringify_v0';
import deepCopy from 'deep-copy';
import { describe, it } from 'vitest';
import { expect } from 'vitest';

describe('StringifyNode class', () => {
  it('should correctly stringify input data', async () => {
    const node = new StringifyNode(deepCopy(stringify_node_data));
    const inputData = { input: { key: 'value' } };
    const result = await node.compute(
      inputData,
      'run',
      console.log,
      console.error,
      console.log,
      '/'
    );
    expect(result).toBe(JSON.stringify(inputData.input, null, 2));
    expect(node.data.dirty).toBe(false);
  });

  it('should return input if it cannot be stringified', async () => {
    const node = new StringifyNode(deepCopy(stringify_node_data));
    const inputData = { input: undefined };
    const result = await node.compute(
      inputData,
      'run',
      console.log,
      console.error,
      console.log,
      '/'
    );
    expect(result).toBe(inputData.input);
    expect(node.data.dirty).toBe(false);
  });

  it('should handle different types of input', async () => {
    const node = new StringifyNode(deepCopy(stringify_node_data));
    const inputDataArray = { input: [1, 2, 3] };
    const resultArray = await node.compute(
      inputDataArray,
      'run',
      console.log,
      console.error,
      console.log,
      '/'
    );
    expect(resultArray).toBe(JSON.stringify(inputDataArray.input, null, 2));

    const inputDataObject = { input: { a: 1, b: 2 } };
    const resultObject = await node.compute(
      inputDataObject,
      'run',
      console.log,
      console.error,
      console.log,
      '/'
    );
    expect(resultObject).toBe(JSON.stringify(inputDataObject.input, null, 2));

    const inputDataString = { input: 'test string' };
    const resultString = await node.compute(
      inputDataString,
      'run',
      console.log,
      console.error,
      console.log,
      '/'
    );
    expect(resultString).toBe(JSON.stringify(inputDataString.input, null, 2));
  });

  it('should not mutate the input node', async () => {
    const originalNodeData = deepCopy(stringify_node_data);
    const node = new StringifyNode(originalNodeData);
    const inputData = { input: { key: 'value' } };

    await node.compute(inputData, 'run', console.log, console.error, console.log, '/');

    // Check if dirty flag is updated
    expect(node.data.dirty).toBe(false);

    // Ensure other properties remain unchanged
    expect(node.id).toEqual(originalNodeData.id);
    expect(node.type).toEqual(originalNodeData.type);
    expect(node.position).toEqual(originalNodeData.position);
  });
});
