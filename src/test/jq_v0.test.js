import { describe, it, vi } from 'vitest';
import { expect } from 'vitest'
import { jq_v0, jq_v0_node } from '$lib/compute/jq_v0'
import deepCopy from 'deep-copy';

const log = console.log
const input = { input: { x: [{ y: 2 }, { y: 4 }] } };

describe('jq function', () =>
{
    it('should process data correctly with JQ filter', async () => {
        const node = deepCopy(jq_v0_node);
        node.data.text = '.x[].y';
        const result = await jq_v0(node, input, 'run', log, log, log, '/');
        expect(result).toEqual([2, 4]);
        vi.restoreAllMocks();
    });

    it('should handle invalid JQ filter', async () => {
        const node = deepCopy(jq_v0_node);
        node.data.text = 'invalid filter';
        const result = await jq_v0(node, input, 'run', log, log, log, '/');
        expect(result).toBeUndefined();
        vi.restoreAllMocks();
    });
});
