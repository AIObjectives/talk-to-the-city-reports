import { describe, it, vi, beforeEach } from 'vitest';
import { expect } from 'vitest';
import { json, json_node } from '$lib/compute/json';
import deepCopy from 'deep-copy';
import * as utils from '$lib/utils';

describe('json function', () => {
	beforeEach(() => {
		vi.restoreAllMocks();
		json_node.data = {
			filename: '',
			size_kb: 0,
			dirty: false,
			gcs_path: '',
			output: null
		};
	});

	it('should process JSON data correctly from GCS', async () => {
		vi.spyOn(utils, 'readFileFromGCS').mockResolvedValue('{"name": "Alice", "age": 30}');
		const node = deepCopy(json_node);
		node.data.gcs_path = 'path/to/file.json';
		const result = await json(node, null, null, null, null, null, null);
		expect(result).toEqual({ name: 'Alice', age: 30 });
		expect(node.data.dirty).toBe(false);
		expect(node.data.output).toEqual({ name: 'Alice', age: 30 });
	});

	it('should handle invalid JSON data from GCS', async () => {
		vi.spyOn(utils, 'readFileFromGCS').mockResolvedValue('invalid json');
		const node = deepCopy(json_node);
		node.data.gcs_path = 'path/to/file.json';
		let errorOccurred = false;
		try {
			await json(node, null, null, null, null, null, null);
		} catch (e) {
			errorOccurred = true;
		}
		expect(errorOccurred).toBe(true);
	});

	it('should update dirty state correctly', async () => {
		const node = deepCopy(json_node);
		node.data.gcs_path = 'path/to/file.json';
		node.data.dirty = true;
		vi.spyOn(utils, 'readFileFromGCS').mockResolvedValue('{}');
		await json(node, null, null, null, null, null, null);
		expect(node.data.dirty).toBe(false);
	});
});
