import { describe, it, vi, expect } from 'vitest';
import PyodideNodeV0, { pyodide_node_data } from '$lib/compute/pyodide_v0';
import deepCopy from 'deep-copy';
import _ from 'lodash';

describe('PyodideNodeV0 tests', () => {
  it('should execute python script and return outputData', async () => {
    const node = new PyodideNodeV0(deepCopy(pyodide_node_data));
    node.data.text = 'outputData = 123';
    const output = await node.compute({}, 'run', vi.fn(), vi.fn(), vi.fn(), 'test_slug', vi.fn());
    expect(output).toEqual(123);
  }, 10000);

  it('should be able to pass input to outputData', async () => {
    const node = new PyodideNodeV0(deepCopy(pyodide_node_data));
    node.data.text = 'outputData = inputData["input_0"]';
    node.data.input_ids['input_0'] = 'some_node';
    const output = await node.compute(
      { some_node: 123 },
      'run',
      vi.fn(),
      vi.fn(),
      vi.fn(),
      'test_slug',
      vi.fn()
    );
    expect(output).toEqual(123);
  }, 10000);

  it('test passing in complex data from jsonapi', async () => {
    const data = await fetch('https://dummyjson.com/products');
    const json = await data.json();
    const node = new PyodideNodeV0(deepCopy(pyodide_node_data));
    node.data.text = 'outputData = inputData["input_0"]';
    node.data.input_ids['input_0'] = 'some_node';
    const output = await node.compute(
      { some_node: json },
      'run',
      vi.fn(),
      vi.fn(),
      vi.fn(),
      'test_slug',
      vi.fn()
    );
    expect(output).toEqual(json);
  }, 10000);
});
