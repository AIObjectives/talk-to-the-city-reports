import { describe, it, vi, beforeEach } from 'vitest';
import { expect } from 'vitest';
import TranslateNode, { translate_node_data } from '$lib/compute/translate_v0';
import deepCopy from 'deep-copy';
import * as utils from '$lib/utils';

describe('TranslateNode class', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('translates the input data', async () => {
    // vi.spyOn(utils, 'readFileFromGCS').mockResolvedValue(JSON.stringify([{ key: 'translated value' }]));
    // const node = new TranslateNode({id: 'translate', data: deepCopy(translate_node_data), position: { x: 0, y: 0 }, type: 'translate_v0'});
    // node.data.keys = ['key'];
    // const inputData = { open_ai_key: 'test_key', data: [{ key: 'value' }] };
    // const result = await node.compute(inputData);
    // expect(result).toEqual([{ key: 'translated value' }]);
    // expect(node.data.dirty).toBe(false);
    // expect(node.data.cache).toBeNull();
  });

  it('uses cached translations when available', async () => {
    // vi.spyOn(utils, 'readFileFromGCS').mockResolvedValue(JSON.stringify([{ key: 'cached translation' }]));
    // const node = new TranslateNode({id: 'translate', data: deepCopy(translate_node_data), position: { x: 0, y: 0 }, type: 'translate_v0'});
    // node.data.keys = ['key'];
    // node.data.gcs_path = 'test_path';
    // const inputData = { open_ai_key: 'test_key', data: [{ key: 'value' }] };
    // const result = await node.compute(inputData);
    // expect(result).toEqual([{ key: 'cached translation' }]);
    // expect(node.data.dirty).toBe(false);
    // expect(node.data.cache).toBeNull();
  });
});
