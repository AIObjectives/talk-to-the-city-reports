import { describe, it, vi, beforeEach } from 'vitest';
import { expect } from 'vitest';
import JSONNode, { json_node_data } from '$lib/compute/json_v0';
import deepCopy from 'deep-copy';
import * as utils from '$lib/utils';

describe('JSONNode class', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should process JSON data correctly from GCS', async () => {
    vi.spyOn(utils, 'readFileFromGCS').mockResolvedValue('{"name": "Alice", "age": 30}');
    const node = new JSONNode({
      id: 'json',
      data: deepCopy(json_node_data),
      position: { x: 0, y: 0 },
      type: 'json_v0'
    });
    node.data.gcs_path = 'path/to/file.json';
    const result = await node.compute();
    expect(result).toEqual({ name: 'Alice', age: 30 });
    expect(node.data.dirty).toBe(false);
    expect(node.data.output).toEqual({ name: 'Alice', age: 30 });
  });

  it('should handle invalid JSON data from GCS', async () => {
    vi.spyOn(utils, 'readFileFromGCS').mockResolvedValue('invalid json');
    const node = new JSONNode({
      id: 'json',
      data: deepCopy(json_node_data),
      position: { x: 0, y: 0 },
      type: 'json_v0'
    });
    node.data.gcs_path = 'path/to/file.json';
    let errorOccurred = false;
    try {
      await node.compute();
    } catch (e) {
      errorOccurred = true;
    }
    expect(errorOccurred).toBe(true);
  });

  it('should update dirty state correctly', async () => {
    const node = new JSONNode({
      id: 'json',
      data: deepCopy(json_node_data),
      position: { x: 0, y: 0 },
      type: 'json_v0'
    });
    node.data.gcs_path = 'path/to/file.json';
    node.data.dirty = true;
    vi.spyOn(utils, 'readFileFromGCS').mockResolvedValue('{}');
    await node.compute();
    expect(node.data.dirty).toBe(false);
  });
});
