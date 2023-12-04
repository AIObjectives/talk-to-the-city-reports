import { describe, it } from 'vitest';
import { expect } from 'vitest'
import { limit_csv, limit_csv_node } from '$lib/compute/limit_csv'
import deepCopy from 'deep-copy';

describe('limit_csv function', () => {
    it('should limit the number of rows correctly', async () => {
        const node = deepCopy(limit_csv_node);
        const inputData = { csv: [{ name: 'Alice' }, { name: 'Bob' }, { name: 'Charlie' }] };
        const result = await limit_csv(node, inputData, null);
        expect(result).toEqual([{ name: 'Alice' }, { name: 'Bob' }]);
    });
    it('should limit the number of rows correctly, for an object', async () =>
    {
        const node = deepCopy(limit_csv_node);
        node.data.number = 1;
        const inputData = { csv: { 1: { name: 'Alice' }, 2: { name: 'Bob' }, 3: { name: 'Charlie' } } };
        const result = await limit_csv(node, inputData, null);
        expect(result).toEqual({ 1: { name: 'Alice' } });
    });
    it('should return all rows if limit is greater than number of rows', async () => {
        const node = deepCopy(limit_csv_node);
        node.data.number = 5;
        const inputData = { csv: [{ name: 'Alice' }, { name: 'Bob' }] };
        const result = await limit_csv(node, inputData, null);
        expect(result).toEqual([{ name: 'Alice' }, { name: 'Bob' }]);
    });

    it('should return an empty array if input is empty', async () => {
        const node = deepCopy(limit_csv_node);
        const inputData = { csv: [] };
        const result = await limit_csv(node, inputData, null);
        expect(result).toEqual([]);
    });

    it('should not mutate the input node', async () => {
        const originalNode = deepCopy(limit_csv_node);
        const nodeCopy = deepCopy(originalNode);
        const inputData = { csv: [{ name: 'Alice' }, { name: 'Bob' }, { name: 'Charlie' }] };

        await limit_csv(nodeCopy, inputData, null);

        // Check if dirty flag is updated
        expect(nodeCopy.data.dirty).toBe(false);

        // Ensure other properties remain unchanged
        expect(nodeCopy.id).toEqual(originalNode.id);
        expect(nodeCopy.type).toEqual(originalNode.type);
        expect(nodeCopy.position).toEqual(originalNode.position);
    });
});