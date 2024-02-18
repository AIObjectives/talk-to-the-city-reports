import { describe, it, vi, expect, beforeEach, afterEach } from 'vitest';
import PythonNodeV0, { python_node_data } from '$lib/compute/python_v0';
import type PythonData from '$lib/compute/python_v0';
import deepCopy from 'deep-copy';
import _ from 'lodash';

describe('PythonNodeV0 mocking', () => {
  let node: PythonNodeV0;
  let inputData: PythonData;
  let fetchMock: any;

  beforeEach(() => {
    node = new PythonNodeV0(deepCopy(python_node_data));
    inputData = { key: 'value' };
    fetchMock = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve('{"result": "output"}')
      })
    );
    global.fetch = fetchMock;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should execute python script and return output', async () => {
    node.data.text = 'print("Hello, World!")';
    const output = await node.compute(inputData, 'run', vi.fn(), vi.fn(), vi.fn(), 'test_slug');
    expect(output).toEqual({ result: 'output' });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('should handle fetch errors gracefully', async () => {
    fetchMock.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 500
      })
    );
    const errorSpy = vi.fn();
    await node.compute(inputData, 'run', vi.fn(), errorSpy, vi.fn(), 'test_slug');
    expect(errorSpy).toHaveBeenCalledWith('HTTP error! status: 500');
  });

  it('should handle invalid JSON response', async () => {
    fetchMock.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve('Invalid JSON')
      })
    );
    const output = await node.compute(inputData, 'run', vi.fn(), vi.fn(), vi.fn(), 'test_slug');
    expect(output).toEqual('Invalid JSON');
  });

  it('should handle non-string JSON response', async () => {
    fetchMock.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ result: 42 })
      })
    );
    const output = await node.compute(inputData, 'run', vi.fn(), vi.fn(), vi.fn(), 'test_slug');
    expect(output).toEqual({ result: 42 });
  });

  it('should update node data output with the response', async () => {
    node.data.text = 'print("Hello, World!")';
    await node.compute(inputData, 'run', vi.fn(), vi.fn(), vi.fn(), 'test_slug');
    expect(node.data.output).toEqual({ result: 'output' });
  });
});
