import { describe, it, vi, expect, beforeEach } from 'vitest';
import ChatNode, { chat_node_data } from '$lib/compute/chat_v0';
import deepCopy from 'deep-copy';
import _ from 'lodash';

vi.mock('$lib/gpt', () => ({
  openai: vi.fn()
}));

describe('ChatNode class', () => {
  let node;
  let inputData;
  let Cookies;

  beforeEach(() => {
    node = new ChatNode(deepCopy(chat_node_data));
    inputData = {};
    Cookies = {
      get: vi.fn(),
      set: vi.fn()
    };
    vi.clearAllMocks();
  });

  it('compute should set output to messages and dirty to false', async () => {
    const messages = [{ role: 'user', content: 'Hello' }];
    node.data.messages = messages;
    const output = await node.compute(
      inputData,
      'context',
      console.log,
      console.error,
      console.log,
      'slug',
      Cookies
    );
    expect(output).toEqual(messages);
    expect(node.data.dirty).toBe(false);
  });
});
