import { describe, it } from 'vitest';
import { expect } from 'vitest';
import { count_tokens, count_tokens_node } from '$lib/compute/count_tokens';
import deepCopy from 'deep-copy';

const log = console.log;

describe('count_tokens function', () => {
	it('should correctly count tokens in input data', async () => {
		const inputData = { csv: [{ 'comment-body': 'Hello' }, { 'comment-body': 'World' }] };
		const node = deepCopy(count_tokens_node);
		const count = await count_tokens(node, inputData, 'run', log, log, log, '/');
		expect(count).toBe(2);
		expect(node.data.dirty).toBe(false);
	});
	it('should not count tokens if input data length matches and node is not dirty', async () => {
		const inputData = { csv: [{ 'comment-body': 'Hello' }, { 'comment-body': 'World' }] };
		const node = deepCopy(count_tokens_node);
		node.data.csv_length = inputData.csv.length;
		node.data.dirty = false;
		await count_tokens(node, inputData, 'run', log, log, log, '/');
		expect(node.data.num_tokens).toBe(0);
	});
});
