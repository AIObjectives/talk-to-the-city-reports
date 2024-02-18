import { describe, it } from 'vitest';
import { expect } from 'vitest';
import CountTokensNode, { count_tokens_node_data } from '$lib/compute/count_tokens_v0';
import deepCopy from 'deep-copy';

describe('CountTokensNode class', () => {
  it('should correctly count tokens in input data', async () => {
    const inputData = { csv: [{ 'comment-body': 'Hello' }, { 'comment-body': 'World' }] };
    const node = new CountTokensNode(deepCopy(count_tokens_node_data));
    const count = await node.compute(inputData, 'run', console.log, console.log, console.log, '/');
    expect(count).toBe(2);
    expect(node.data.dirty).toBe(false);
  });

  it('should not count tokens if input data length matches and node is not dirty', async () => {
    const inputData = { csv: [{ 'comment-body': 'Hello' }, { 'comment-body': 'World' }] };
    const node = new CountTokensNode(deepCopy(count_tokens_node_data));
    node.data.csv_length = inputData.csv.length;
    node.data.dirty = false;
    const count = await node.compute(inputData, 'run', console.log, console.log, console.log, '/');
    expect(count).toBe(node.data.num_tokens);
  });

  it('should count tokens if the input data is a string', async () => {
    const inputData = { csv: 'Hello World' };
    const node = new CountTokensNode(deepCopy(count_tokens_node_data));
    const count = await node.compute(inputData, 'run', console.log, console.log, console.log, '/');
    expect(count).toBe(2);
    expect(node.data.dirty).toBe(false);
  });
});
