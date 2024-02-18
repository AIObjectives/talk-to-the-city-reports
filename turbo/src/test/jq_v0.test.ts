import { describe, it, vi } from 'vitest';
import { expect } from 'vitest';
import JqNodeV0, { jq_v0_node_data } from '$lib/compute/jq_v0';
import deepCopy from 'deep-copy';

const log = console.log;
const input = { input: { x: [{ y: 2 }, { y: 4 }] } };

describe('jq function', () => {
  it('should process data correctly with JQ filter', async () => {
    const node = new JqNodeV0(deepCopy(jq_v0_node_data));
    node.data.text = '.x[].y';
    const result = await node.compute(input, 'run', log, log, log, '/');
    expect(result).toEqual([2, 4]);
    vi.restoreAllMocks();
  });

  it('should handle invalid JQ filter', async () => {
    const node = new JqNodeV0(deepCopy(jq_v0_node_data));
    node.data.text = 'invalid filter';
    const result = await node.compute(input, 'run', log, log, log, '/');
    expect(result).toBeUndefined();
    vi.restoreAllMocks();
  });
});
