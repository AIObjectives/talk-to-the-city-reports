import { describe, it, expect, vi, beforeEach } from 'vitest';
import PineconeKeyNode, { pinecone_key_node_data } from '$lib/compute/pinecone_key_v0';
import deepCopy from 'deep-copy';
import Cookies from 'js-cookie';

describe('PineconeKeyNode class', () => {
  let node;
  let inputData;
  const slug = 'test_slug';

  beforeEach(() => {
    node = new PineconeKeyNode(deepCopy(pinecone_key_node_data));
    node.id = 'test_pinecone_key';
    inputData = {};
    Cookies.remove('tttc_pinecone_key_test_pinecone_key');
  });

  it('should set the key in cookies if the UI key is provided', async () => {
    const ui_key = 'test_pinecone_key_value';
    node.data.text = ui_key;
    await node.compute(inputData, 'load', vi.fn(), vi.fn(), vi.fn(), slug, Cookies);
    expect(Cookies.get('tttc_pinecone_key_test_pinecone_key')).toEqual(ui_key);
    expect(node.data.text).toEqual('...(key hidden)');
  });

  it('should use the local key from cookies if available', async () => {
    const local_key = 'local_pinecone_key_value';
    Cookies.set('tttc_pinecone_key_test_pinecone_key', local_key);
    const result = await node.compute(inputData, 'load', vi.fn(), vi.fn(), vi.fn(), slug, Cookies);
    expect(result).toEqual(local_key);
    expect(node.data.text).toEqual('...(key hidden)');
  });

  it('should return an empty string if no key is provided or available in cookies', async () => {
    const result = await node.compute(inputData, 'load', vi.fn(), vi.fn(), vi.fn(), slug, Cookies);
    expect(result).toEqual('');
    expect(node.data.text).toEqual('');
  });
});
