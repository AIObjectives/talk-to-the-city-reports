import { describe, it, expect, vi, beforeEach } from 'vitest';
import SecretNode, { secret_node_data } from '$lib/compute/secret_v0';
import deepCopy from 'deep-copy';
import Cookies from 'js-cookie';

describe('Secret Node class', () => {
  let node;
  let inputData;
  const slug = 'test_slug';

  beforeEach(() => {
    node = new SecretNode(deepCopy(secret_node_data));
    inputData = {};
    Cookies.remove('tttc_secret_' + node.data.rand_id);
  });

  it('should set the key in cookies if the UI key is provided', async () => {
    const ui_key = 'secret';
    node.data.text = ui_key;
    await node.compute(inputData, 'load', vi.fn(), vi.fn(), vi.fn(), slug, Cookies);
    expect(Cookies.get('tttc_secret_' + node.data.rand_id)).toEqual(ui_key);
    expect(node.data.text).toEqual('...(key hidden)');
  });

  it('should use the local key from cookies if available', async () => {
    const local_key = 'secret';
    Cookies.set('tttc_secret_' + node.data.rand_id, local_key);
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
