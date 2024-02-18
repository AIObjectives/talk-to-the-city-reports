import EditCSVNode, { edit_csv_node_data } from '$lib/compute/edit_csv_v0';
import deepCopy from 'deep-copy';
import { describe, it, vi } from 'vitest';
import { expect } from 'vitest';

describe('EditCSVNode class', () => {
  it('generates new columns', async () => {
    const nodeData = deepCopy(edit_csv_node_data);
    nodeData.data.generate = { newColumn: 'newValue' };
    const node = new EditCSVNode(nodeData);
    const inputData = { csv: [{ column1: 'value1' }] };
    const output = await node.compute(
      inputData,
      null,
      vi.fn(),
      vi.fn(),
      vi.fn(),
      'test_slug',
      vi.fn()
    );
    expect(output).toEqual([{ column1: 'value1', newColumn: 'newValue' }]);
  });

  it('deletes columns', async () => {
    const nodeData = deepCopy(edit_csv_node_data);
    nodeData.data.delete = ['column1'];
    const node = new EditCSVNode(nodeData);
    const inputData = { csv: [{ column1: 'value1', column2: 'value2' }] };
    const output = await node.compute(
      inputData,
      null,
      vi.fn(),
      vi.fn(),
      vi.fn(),
      'test_slug',
      vi.fn()
    );
    expect(output).toEqual([{ column2: 'value2' }]);
  });

  it('renames columns', async () => {
    const nodeData = deepCopy(edit_csv_node_data);
    nodeData.data.rename = { column1: 'newColumn1' };
    const node = new EditCSVNode(nodeData);
    const inputData = { csv: [{ column1: 'value1', column2: 'value2' }] };
    const output = await node.compute(
      inputData,
      null,
      vi.fn(),
      vi.fn(),
      vi.fn(),
      'test_slug',
      vi.fn()
    );
    expect(output).toEqual([{ newColumn1: 'value1', column2: 'value2' }]);
  });

  it('returns undefined if input is undefined', async () => {
    const nodeData = deepCopy(edit_csv_node_data);
    const node = new EditCSVNode(nodeData);
    const inputData = { csv: undefined };
    const output = await node.compute(
      inputData,
      null,
      vi.fn(),
      vi.fn(),
      vi.fn(),
      'test_slug',
      vi.fn()
    );
    expect(output).toBeUndefined();
  });

  it('handles multiple operations', async () => {
    const nodeData = deepCopy(edit_csv_node_data);
    nodeData.data.generate = { newColumn: 'newValue' };
    nodeData.data.delete = ['column1'];
    nodeData.data.rename = { column2: 'newColumn2' };
    const node = new EditCSVNode(nodeData);
    const inputData = { csv: [{ column1: 'value1', column2: 'value2' }] };
    const output = await node.compute(
      inputData,
      null,
      vi.fn(),
      vi.fn(),
      vi.fn(),
      'test_slug',
      vi.fn()
    );
    expect(output).toEqual([{ newColumn: 'newValue', newColumn2: 'value2' }]);
  });

  it('does not modify input if no operations are specified', async () => {
    const nodeData = deepCopy(edit_csv_node_data);
    const node = new EditCSVNode(nodeData);
    const inputData = { csv: [{ column1: 'value1', column2: 'value2' }] };
    const output = await node.compute(
      inputData,
      null,
      vi.fn(),
      vi.fn(),
      vi.fn(),
      'test_slug',
      vi.fn()
    );
    expect(output).toEqual(inputData.csv);
  });

  it('does not crash if input is empty', async () => {
    const nodeData = deepCopy(edit_csv_node_data);
    const node = new EditCSVNode(nodeData);
    const inputData = { csv: [] };
    const output = await node.compute(
      inputData,
      null,
      vi.fn(),
      vi.fn(),
      vi.fn(),
      'test_slug',
      vi.fn()
    );
    expect(output).toBeUndefined();
  });
});
