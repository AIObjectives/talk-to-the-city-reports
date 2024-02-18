import ReportNode, { report_node_data } from '$lib/compute/report_v0';
import deepCopy from 'deep-copy';
import { describe, it } from 'vitest';
import { expect } from 'vitest';

describe('ReportNode class', () => {
  it('should set the output of the node to the input data', async () => {
    const node = new ReportNode(deepCopy(report_node_data));
    const inputData = { json: { key: 'value' } };
    const result = await node.compute(
      inputData,
      'run',
      console.log,
      console.error,
      console.log,
      'test_slug'
    );
    expect(result).toEqual({ key: 'value' });
    expect(node.data.output).toEqual({ key: 'value' });
    expect(node.data.dirty).toBe(false);
  });

  it('should handle empty input data', async () => {
    const node = new ReportNode(deepCopy(report_node_data));
    const inputData = {};
    const result = await node.compute(
      inputData,
      'run',
      console.log,
      console.error,
      console.log,
      'test_slug'
    );
    expect(result).toBeUndefined();
    expect(node.data.output).toBeUndefined();
    expect(node.data.dirty).toBe(false);
  });

  it('should not mutate the input node', async () => {
    const originalNodeData = deepCopy(report_node_data);
    const node = new ReportNode(originalNodeData);
    const inputData = { json: { key: 'value' } };

    await node.compute(inputData, 'run', console.log, console.error, console.log, 'test_slug');

    // Check if dirty flag is updated
    expect(node.data.dirty).toBe(false);

    // Ensure other properties remain unchanged
    expect(node.id).toEqual(originalNodeData.id);
    expect(node.type).toEqual(originalNodeData.type);
    expect(node.position).toEqual(originalNodeData.position);
  });
});
