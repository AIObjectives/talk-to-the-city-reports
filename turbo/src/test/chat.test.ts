import { describe, it, vi, expect, beforeEach } from 'vitest';
import ChatNode, { chat_node_data } from '$lib/compute/chat_v0';
import deepCopy from 'deep-copy';
import mock_responses from '$lib/mock_data/gpt_responses';
import { openai } from '$lib/gpt';
import CryptoJS from 'crypto-js';
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

	it('chat should add assistant response to messages', async () => {
		const messages = [{ role: 'user', content: 'Hello' }];
		const dataset = { graph: { find: vi.fn(() => ({ node: { data: { output: 'test_key' } } })) } };
		const key = 'test_key';
		const response = 'Hello, how can I help you?';

		vi.spyOn(CryptoJS, 'SHA256').mockReturnValue({ toString: vi.fn(() => 'hash') });
		openai.mockResolvedValue(response);

		node.data.initial_messages = [{ role: 'system', content: 'System message' }];
		const chatOutput = await node.chat(messages, dataset, key);
		expect(chatOutput).toEqual([
			...node.data.initial_messages,
			...messages,
			{ role: 'assistant', content: response }
		]);
		expect(openai).toHaveBeenCalledWith(
			key,
			node.data.messages,
			'true',
			'hash',
			mock_responses,
			null
		);
	});

	it('chat should use initial_messages if only one message is present', async () => {
		const messages = [{ role: 'user', content: 'Hello' }];
		const dataset = { graph: { find: vi.fn(() => ({ node: { data: { output: 'test_key' } } })) } };
		const key = 'test_key';
		const response = 'Hello, how can I help you?';

		vi.spyOn(CryptoJS, 'SHA256').mockReturnValue({ toString: vi.fn(() => 'hash') });
		openai.mockResolvedValue(response);

		node.data.initial_messages = [{ role: 'system', content: 'System message' }];
		const chatOutput = await node.chat(messages, dataset, key);
		expect(chatOutput).toEqual([
			{ role: 'system', content: 'System message' },
			...messages,
			{ role: 'assistant', content: response }
		]);
	});
});
