import { describe, it, vi, expect } from 'vitest';
import PythonNodeV0, { python_node_data } from '$lib/compute/python_v0';
import deepCopy from 'deep-copy';
import _ from 'lodash';
import dotenv from 'dotenv';
dotenv.config();

describe('PythonNodeV0 integration', () => {
  it('should execute python script and return outputData', async () => {
    if (import.meta.env.VITE_PYTHON_LAMBDA_SECRET) {
      const node = new PythonNodeV0(deepCopy(python_node_data));
      node.data.text = 'outputData = 123';
      const output = await node.compute({}, 'run', vi.fn(), vi.fn(), vi.fn(), 'test_slug', vi.fn());
      expect(output).toEqual(123);
    }
  }, 10000);

  it('should be able to pass input to outputData', async () => {
    if (import.meta.env.VITE_PYTHON_LAMBDA_SECRET) {
      const node = new PythonNodeV0(deepCopy(python_node_data));
      node.data.text = 'outputData = inputData[0]';
      node.data.input_ids.inputs.push('some_node');
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
    }
  }, 10000);

  it('should be able to make get requests to jsonapi', async () => {
    if (import.meta.env.VITE_PYTHON_LAMBDA_SECRET) {
      const node = new PythonNodeV0(deepCopy(python_node_data));
      node.data.text =
        'import requests; outputData = requests.get("https://dummyjson.com/products").json()';
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
      expect(_.keys(output)).includes('products');
    }
  }, 10000);
});
