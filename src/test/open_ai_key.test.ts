import { describe, it } from 'vitest';
import { expect } from 'vitest';
import { open_ai_key, open_ai_key_node } from '$lib/compute/open_ai_key';
import deepCopy from 'deep-copy';
import Cookies from './test/mocks/js-cookie';

describe('open_ai_key function', () => {
	it('should set the key in cookies if the UI key is valid', async () => {
		Cookies.remove('open_ai_key');
		const node = deepCopy(open_ai_key_node);
		node.data.text = 'sk-' + 'a'.repeat(48);
		let response = await open_ai_key(node, {}, null, null, null, null, null, Cookies);
		expect(Cookies.get('open_ai_key')).toEqual(response);
		expect(node.data.text).toEqual('sk-...(key hidden)');
		expect(node.data.dirty).toBe(false);
	});
	it('if ui key is set but invalid use local key', async () => {
		const node = deepCopy(open_ai_key_node);
		node.data.text = 'invalid_key';
		const key = 'sk-' + 'a'.repeat(48);
		Cookies.set('open_ai_key', key);
		const result = await open_ai_key(node, {}, null, null, null, null, null, Cookies);
		expect(node.data.text).toEqual('sk-...(key hidden)');
		expect(result).toEqual(key);
		expect(node.data.dirty).toBe(false);
	});
	it('should set the node text to "Invalid key" if the UI key is not valid and there is no local key', async () => {
		Cookies.remove('open_ai_key');
		const node = deepCopy(open_ai_key_node);
		node.data.text = 'invalid_key';
		await open_ai_key(node, {}, null, null, null, null, null, Cookies);
		expect(node.data.text).toEqual('Invalid key');
		expect(node.data.dirty).toBe(false);
	});
	it('should not mutate the node if the UI key and local key are both valid', async () => {
		Cookies.remove('open_ai_key');
		const originalNode = deepCopy(open_ai_key_node);
		const nodeCopy = deepCopy(originalNode);
		nodeCopy.data.text = 'sk-' + 'a'.repeat(48);
		Cookies.set('open_ai_key', 'sk-' + 'a'.repeat(48));
		await open_ai_key(nodeCopy, {}, null, null, null, null, null, Cookies);
		expect(nodeCopy.data.dirty).toBe(false);
		expect(nodeCopy.id).toEqual(originalNode.id);
		expect(nodeCopy.type).toEqual(originalNode.type);
		expect(nodeCopy.position).toEqual(originalNode.position);
	});
});
