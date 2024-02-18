import { describe, it, vi } from 'vitest';
import { expect } from 'vitest';
import JqNodeV1, { jq_node_data } from '$lib/compute/jq_v1';
import _ from 'lodash';

const log = console.log;
const input = { input: { x: [{ y: 2 }, { y: 4 }] } };

// Please note these tests do not cover backend node-jq functionality
// They only cover the frontend jq_web functionality
// todo: please make sure to test backend functionality as well

describe('jq function', () => {
  it('should process data correctly with JQ filter', async () => {
    const node = new JqNodeV1(_.cloneDeep(jq_node_data));
    node.data.text = '.x[].y';
    const result = await node.compute(input, 'run', log, log, log, '/', null);
    try {
      expect(result).toEqual([2, 4]);
    } catch (e) {
      expect(result).toEqual(['2', '4']);
    }
    vi.restoreAllMocks();
  });

  it('should handle invalid JQ filter', async () => {
    const node = new JqNodeV1(_.cloneDeep(jq_node_data));
    node.data.text = 'invalid filter';
    const result = await node.compute(input, 'run', log, log, log, '/', null);
    expect(result).toBeUndefined();
    vi.restoreAllMocks();
  });

  it('should return an empty array when no matches found', async () => {
    const node = new JqNodeV1(_.cloneDeep(jq_node_data));
    node.data.text = '.x[].z';
    const result = await node.compute(input, 'run', log, log, log, '/', null);
    expect(result).toEqual([null, null]);
    vi.restoreAllMocks();
  });

  it('should process data correctly with a complex JQ filter', async () => {
    const complexInput = {
      input: {
        items: [
          { id: 1, name: 'apple', category: 'fruits' },
          { id: 2, name: 'banana', category: 'fruits' },
          { id: 3, name: 'broccoli', category: 'vegetables' }
        ]
      }
    };
    const node = new JqNodeV1(_.cloneDeep(jq_node_data));
    node.data.text = '.items[] | select(.category == "fruits") | .name';
    const result = await node.compute(complexInput, 'run', log, log, log, '/', null);
    expect(result).toEqual(['apple', 'banana']);
    vi.restoreAllMocks();
  });

  it('should return undefined if the input is null or undefined', async () => {
    const node = new JqNodeV1(_.cloneDeep(jq_node_data));
    node.data.text = '.x[].y';
    const resultNullInput = await node.compute(null, 'run', log, log, log, '/', null);
    const resultUndefinedInput = await node.compute(undefined, 'run', log, log, log, '/', null);
    expect(resultNullInput).toBeUndefined();
    expect(resultUndefinedInput).toBeUndefined();
    vi.restoreAllMocks();
  });
});
