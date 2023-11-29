// translate.test.ts
import { translate, translate_node } from '$lib/compute/translate';
import deepCopy from 'deep-copy';
import { describe, it, vi } from 'vitest';
import { expect } from 'vitest';

vi.mock('$lib/utils', () => ({
	readFileFromGCS: vi.fn(() => Promise.resolve(JSON.stringify([{ key: 'cached translation' }]))),
	uploadDataToGCS: vi.fn(() => Promise.resolve())
}));

async function call(node, inputData) {
	return await translate(
		node,
		inputData,
		'run',
		console.log,
		console.error,
		console.log,
		'test_slug'
	);
}

describe('translate', () => {
	it('translates the input data', async () => {
		// const node = deepCopy(translate_node);
		// node.data.keys = ['key'];
		// const inputData = { open_ai_key: 'test_key', data: [{ key: 'value' }] };
		// const output = await call(node, inputData);
		// expect(output).toEqual([{ key: 'translated value' }]);
	});
	it('uses cached translations when available', async () => {
		// const node = deepCopy(translate_node);
		// node.data.keys = ['key'];
		// node.data.gcs_path = 'test_path';
		// const inputData = { open_ai_key: 'test_key', data: [{ key: 'value' }] };
		// const output = await call(node, inputData);
		// expect(output).toEqual([{ key: 'cached translation' }]);
	});
});
