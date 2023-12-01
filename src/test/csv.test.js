import { describe, it, vi, beforeEach } from 'vitest';
import { expect } from 'vitest'
import { csv, csv_node } from '$lib/compute/csv'
import deepCopy from 'deep-copy';
import * as utils from '$lib/utils';

describe('csv function', () =>
{
    beforeEach(() => {
        // Reset module mocking before each test
        vi.restoreAllMocks();
    });
    it('should process CSV data correctly from GCS', async () => {
        vi.spyOn(utils, 'readFileFromGCS').mockResolvedValue('name,age\nAlice,30\nBob,');
        const node = deepCopy(csv_node);
        node.data.gcs_path = 'path/to/file.csv'
        const result = await csv(node, null, null);
        expect(result).toEqual([{ name: 'Alice', age: '30' }, { name: 'Bob', age: '' }]);
        expect(node.data.dirty).toBe(false);
        expect(node.data.csv).toBeNull();
        vi.restoreAllMocks();
    });

    it('should handle empty CSV data from GCS', async () =>
    {
        vi.spyOn(utils, 'readFileFromGCS').mockResolvedValue('');
        const node = deepCopy(csv_node);
        node.data.gcs_path = 'path/to/file.csv'
        const result = await csv(node, null, null);
        expect(result).toEqual([]);
        expect(node.data.dirty).toBe(false);
        expect(node.data.csv).toBeNull();
        vi.restoreAllMocks();
    });

    it('should handle rows with uneven columns from GCS', async () =>
    {
        vi.spyOn(utils, 'readFileFromGCS').mockResolvedValue('name,age\nAlice,30\nBob');
        const node = deepCopy(csv_node);
        node.data.gcs_path = 'path/to/file.csv'
        const result = await csv(node, null, null);
        expect(result).toEqual([{ name: 'Alice', age: '30' }, { name: 'Bob' }]);
        expect(node.data.dirty).toBe(false);
        expect(node.data.csv).toBeNull();
        vi.restoreAllMocks();
    });
});