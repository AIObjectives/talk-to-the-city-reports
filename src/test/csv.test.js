import { describe, it, vi } from 'vitest';
import { expect } from 'vitest'
import { csv, csv_node } from '$lib/compute/csv'
import deepCopy from 'deep-copy';

vi.mock('$lib/utils', () => ({
    readFileFromGCS: vi.fn(() => Promise.resolve('name,age\nAlice,30\nBob,\n,'))
}));
  
describe('csv function', () => {
    it('should process CSV data correctly', async () => {
        const node = { ...csv_node, data: { ...csv_node.data, gcs_path: 'path/to/file.csv' } };
        const result = await csv(node, null, null);
        expect(result).toEqual([{ name: 'Alice', age: '30' }, { name: 'Bob', age: '' }]);
        expect(node.data.dirty).toBe(false);
        expect(node.data.csv).toBeNull();
    });

    it('should process existing CSV data when gcs_path is not defined', async () => {
        const testData = 'name,age\nJohn,40\nDoe,';
        const csv_node_copy = deepCopy(csv_node);
        csv_node_copy.data.csv = testData;
        csv_node_copy.data.gcs_path = '';
        const result = await csv(csv_node_copy, null, null);
        expect(result).toEqual([{ name: 'John', age: '40' }, { name: 'Doe', age: '' }]);
        expect(csv_node_copy.data.dirty).toBe(false);
        expect(csv_node_copy.data.csv).toBeNull();
    });

    it('should handle empty CSV data', async () => {
        const emptyNode = deepCopy(csv_node);
        emptyNode.data.csv = '';
        const result = await csv(emptyNode, null, null);
        expect(result).toEqual([]);
        expect(emptyNode.data.dirty).toBe(false);
    });

    it('should return an empty array when there are no valid rows', async () => {
        const invalidNode = deepCopy(csv_node);
        invalidNode.data.csv = ',\n,';
        const result = await csv(invalidNode, null, null);
        expect(result).toEqual([]);
        expect(invalidNode.data.dirty).toBe(false);
    });

    it('should process CSV data with special characters correctly', async () => {
        const specialCharNode = deepCopy(csv_node);
        specialCharNode.data.csv = 'name,description\nJohn,"Loves coding, coffee"';
        const result = await csv(specialCharNode, null, null);
        expect(result).toEqual([{ name: 'John', description: 'Loves coding, coffee' }]);
    });

    it('should handle rows with uneven columns', async () => {
        const unevenNode = deepCopy(csv_node);
        unevenNode.data.csv = 'name,age\nAlice,30\nBob';
        const result = await csv(unevenNode, null, null);
        expect(result).toEqual([{ name: 'Alice', age: '30' }, { name: 'Bob' }]);
    });

    it('should not mutate the input node', async () => {
        const originalNode = deepCopy(csv_node);
        originalNode.data.csv = 'name,age\nAlice,30';
        const nodeCopy = deepCopy(originalNode);

        await csv(nodeCopy, null, null);

        expect(nodeCopy.data.csv).toBeNull();
        expect(nodeCopy.data.output).toEqual([{ name: 'Alice', age: '30' }]);
        expect(nodeCopy.data.dirty).toBe(false);

        // Ensure other properties remain unchanged
        expect(nodeCopy.id).toEqual(originalNode.id);
        expect(nodeCopy.type).toEqual(originalNode.type);
        expect(nodeCopy.position).toEqual(originalNode.position);
    });
});