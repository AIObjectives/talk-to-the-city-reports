import JsonataNode, { jsonata_node_data } from '$lib/compute/jsonata_v0';
import deepCopy from 'deep-copy';
import { describe, it } from 'vitest';
import { expect } from 'vitest';

describe('JsonataNode class', () => {
  it('evaluates JSONata expressions', async () => {
    const nodeData = deepCopy(jsonata_node_data);
    nodeData.data.text = '$sum(numbers)';
    const node = new JsonataNode(nodeData);
    const inputData = { json: { numbers: [1, 2, 3] } };
    const output = await node.compute(
      inputData,
      null,
      () => {},
      () => {},
      () => {},
      ''
    );
    expect(output).toEqual(6);
  });

  it('returns undefined if no expression is provided', async () => {
    const nodeData = deepCopy(jsonata_node_data);
    const node = new JsonataNode(nodeData);
    const inputData = { json: { numbers: [1, 2, 3] } };
    const output = await node.compute(
      inputData,
      null,
      () => {},
      () => {},
      () => {},
      ''
    );
    expect(output).toBeUndefined();
  });

  it('catches errors when evaluating expressions', async () => {
    const nodeData = deepCopy(jsonata_node_data);
    nodeData.data.text = 'invalid expression';
    const node = new JsonataNode(nodeData);
    const inputData = { json: { numbers: [1, 2, 3] } };
    const output = await node.compute(
      inputData,
      null,
      () => {},
      () => {},
      () => {},
      ''
    );
    expect(output).toBeUndefined();
  });
});
