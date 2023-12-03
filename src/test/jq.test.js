import { describe, it, vi } from 'vitest';
import { expect } from 'vitest'
import { jq, jq_node } from '$lib/compute/jq'
import deepCopy from 'deep-copy';

const log = console.log
const input = { input: { x: [{ y: 2 }, { y: 4 }] } };

describe('jq function', () =>
{
    it('should process data correctly with JQ filter', async () => {
        const node = deepCopy(jq_node);
        node.data.text = '.x[].y';
        const result = await jq(node, input, 'run', log, log, log, '/');
        console.log(result)
        expect(result).toEqual([2, 4]);
        vi.restoreAllMocks();
    });

    it('should handle invalid JQ filter', async () => {
        const node = deepCopy(jq_node);
        node.data.text = 'invalid filter';
        const result = await jq(node, input, 'run', log, log, log, '/');
        expect(result).toBeUndefined();
        vi.restoreAllMocks();
    });
});
