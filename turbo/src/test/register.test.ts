import { describe, it } from 'vitest';
import { expect } from 'vitest';
import GridNode, { grid_node_data } from '$lib/compute/grid_v0';
import nodes from '$lib/node_register';
import fs from 'fs';
import path from 'path';

const computePath = path.resolve(__dirname, '../lib/compute');

describe('Register class', () => {
  it('test node registeration', async () => {
    nodes.register(GridNode, grid_node_data);
    expect(nodes.nodes).toEqual({ grid_v0: GridNode });
  });
  it('Load all nodes', async () => {
    const files = fs.readdirSync(computePath);
    for (const file of files) {
      if (file.endsWith('.ts')) {
        if (file.includes('llama')) continue;
        const node = await import(`../lib/compute/${file}`);
        expect(node.default.prototype.compute).toBeInstanceOf(Function);
        try {
          expect(node.default.prototype.compute.length).toBe(7);
        } catch (e) {
          expect(node.default.prototype.compute.length).toBe(8);
        }
      }
    }
  });
});
