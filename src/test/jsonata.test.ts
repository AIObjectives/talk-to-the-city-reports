import { jsonata, jsonata_node } from '$lib/compute/jsonata';
import deepCopy from 'deep-copy';
import { describe, it } from 'vitest';
import { expect } from 'vitest';

describe('jsonata', () => {
	it('evaluates JSONata expressions', async () => {
		const node = deepCopy(jsonata_node);
		node.data.text = '$sum(numbers)';
		const inputData = { json: { numbers: [1, 2, 3] } };
		const output = await jsonata(node, inputData, null);
		expect(output).toEqual(6);
	});

	it('returns undefined if no expression is provided', async () => {
		const node = deepCopy(jsonata_node);
		const inputData = { json: { numbers: [1, 2, 3] } };
		const output = await jsonata(node, inputData, null);
		expect(output).toBeUndefined();
	});

	it('catches errors when evaluating expressions', async () => {
		const node = deepCopy(jsonata_node);
		node.data.text = 'invalid expression';
		const inputData = { json: { numbers: [1, 2, 3] } };
		const output = await jsonata(node, inputData, null);
		expect(output).toBeUndefined();
	});
});
