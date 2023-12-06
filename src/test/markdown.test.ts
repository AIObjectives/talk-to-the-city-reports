import MarkdownNode, { markdown_node_data } from '$lib/compute/markdown';
import deepCopy from 'deep-copy';
import { describe, it } from 'vitest';
import { expect } from 'vitest';

describe('MarkdownNode class', () => {
	it('should set markdown data if input is a string', async () => {
		const node = new MarkdownNode(deepCopy(markdown_node_data));
		const inputData = { text: '## Title' };
		const result = await node.compute(inputData, 'run', console.log, console.error, console.log, '/');
		expect(result).toBe('## Title');
		expect(node.data.markdown).toBe('## Title');
		expect(node.data.dirty).toBe(false);
	});

	it('should not set markdown data if input is not a string', async () => {
		const node = new MarkdownNode(deepCopy(markdown_node_data));
		const inputData = { text: 12345 };
		const result = await node.compute(inputData, 'run', console.log, console.error, console.log, '/');
		expect(result).toBe(12345);
		expect(node.data.markdown).toBe('');
		expect(node.data.dirty).toBe(false);
	});

	it('should not set markdown data if input is undefined', async () => {
		const node = new MarkdownNode(deepCopy(markdown_node_data));
		const inputData = {};
		const result = await node.compute(inputData, 'run', console.log, console.error, console.log, '/');
		expect(result).toBeUndefined();
		expect(node.data.markdown).toBe('');
		expect(node.data.dirty).toBe(false);
	});

	it('should not set markdown data if input is null', async () => {
		const node = new MarkdownNode(deepCopy(markdown_node_data));
		const inputData = { text: null };
		const result = await node.compute(inputData, 'run', console.log, console.error, console.log, '/');
		expect(result).toBeNull();
		expect(node.data.markdown).toBe('');
		expect(node.data.dirty).toBe(false);
	});

	it('should not set markdown data if input is an object', async () => {
		const node = new MarkdownNode(deepCopy(markdown_node_data));
		const inputData = { text: { content: '## Title' } };
		const result = await node.compute(inputData, 'run', console.log, console.error, console.log, '/');
		expect(result).toEqual({ content: '## Title' });
		expect(node.data.markdown).toBe('');
		expect(node.data.dirty).toBe(false);
	});
});