import { describe, it } from 'vitest';
import { expect } from 'vitest';
import OpenAIKeyNode, { open_ai_key_node_data } from '$lib/compute/open_ai_key_v0';
import deepCopy from 'deep-copy';
import Cookies from './test/mocks/js-cookie';

describe('OpenAIKeyNode class', () => {
  it('should set the key in cookies if the UI key is valid', async () => {
    Cookies.remove('open_ai_key');
    const node = new OpenAIKeyNode(deepCopy(open_ai_key_node_data));
    node.data.text = 'sk-' + 'a'.repeat(48);
    const response = await node.compute(
      {},
      'load',
      () => {},
      () => {},
      () => {},
      '',
      Cookies
    );
    expect(Cookies.get('open_ai_key')).toEqual(response);
    expect(node.data.text).toEqual('sk-...(key hidden)');
    expect(node.data.dirty).toBe(false);
  });

  it('if ui key is set but invalid use local key', async () => {
    const node = new OpenAIKeyNode(deepCopy(open_ai_key_node_data));
    node.data.text = 'invalid_key';
    const key = 'sk-' + 'a'.repeat(48);
    Cookies.set('open_ai_key', key);
    const result = await node.compute(
      {},
      'load',
      () => {},
      () => {},
      () => {},
      '',
      Cookies
    );
    expect(node.data.text).toEqual('sk-...(key hidden)');
    expect(result).toEqual(key);
    expect(node.data.dirty).toBe(false);
  });

  it('should set the node text to "Invalid key" if the UI key is not valid and there is no local key', async () => {
    Cookies.remove('open_ai_key');
    const node = new OpenAIKeyNode(deepCopy(open_ai_key_node_data));
    node.data.text = 'invalid_key';
    await node.compute(
      {},
      'load',
      () => {},
      () => {},
      () => {},
      '',
      Cookies
    );
    expect(node.data.text).toEqual('Invalid key');
    expect(node.data.dirty).toBe(false);
  });

  it('should not mutate the node if the UI key and local key are both valid', async () => {
    Cookies.remove('open_ai_key');
    const originalNodeData = deepCopy(open_ai_key_node_data);
    const node = new OpenAIKeyNode(originalNodeData);
    node.data.text = 'sk-' + 'a'.repeat(48);
    Cookies.set('open_ai_key', 'sk-' + 'a'.repeat(48));
    await node.compute(
      {},
      'load',
      () => {},
      () => {},
      () => {},
      '',
      Cookies
    );
    expect(node.data.dirty).toBe(false);
    expect(node.id).toEqual(originalNodeData.id);
    expect(node.type).toEqual(originalNodeData.type);
    expect(node.position).toEqual(originalNodeData.position);
  });
});
