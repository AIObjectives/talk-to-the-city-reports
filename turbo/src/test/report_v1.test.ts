import { describe, it, expect, vi, beforeEach } from 'vitest';
import ReportNode, { report_node_data } from '$lib/compute/report_v1';
import deepCopy from 'deep-copy';
import mergeData from '$lib/mock_data/merge/merge.json';
import csvData from '$lib/mock_data/csv/csv.json';
import { readFileFromGCS, uploadJSONToGCS } from '$lib/utils';

vi.mock('$lib/utils', () => ({
  readFileFromGCS: vi.fn(),
  uploadJSONToGCS: vi.fn()
}));

describe('ReportNode class', () => {
  let node;

  beforeEach(() => {
    node = new ReportNode(deepCopy(report_node_data));
    node.data.input_ids.merge = 'merge';
    node.data.input_ids.csv = 'csv';
    vi.clearAllMocks();
  });

  it('sets the output of the node to the input data', async () => {
    const result = await node.compute(
      {
        merge: mergeData,
        csv: csvData
      },
      'run',
      vi.fn(),
      vi.fn(),
      vi.fn(),
      'test_slug',
      vi.fn()
    );
    expect(result.merge).toEqual(mergeData);
    expect(result.csv).toEqual(csvData);
  });

  it('handles translation', async () => {
    node.data.input_ids.merge = '';
    node.data.input_ids.translations = 'translations';
    const result = await node.compute(
      {
        translations: { 'en-US': mergeData },
        csv: csvData
      },
      'run',
      vi.fn(),
      vi.fn(),
      vi.fn(),
      'test_slug',
      vi.fn()
    );
    expect(result.merge).toEqual(mergeData);
    expect(result.csv).toEqual(csvData);
  });

  it('uploads data to GCS on run', async () => {
    await node.compute(
      {
        merge: mergeData,
        csv: csvData
      },
      'run',
      vi.fn(),
      vi.fn(),
      vi.fn(),
      'test_slug',
      vi.fn()
    );
    expect(uploadJSONToGCS).toHaveBeenCalledWith(node, { merge: mergeData }, 'test_slug');
  });

  it('reads data from GCS on load if gcs_path is set and input data is empty', async () => {
    node.data.gcs_path = 'gs://bucket/path/report.json';
    vi.mocked(readFileFromGCS).mockResolvedValue(JSON.stringify({ merge: mergeData }));
    const result = await node.compute({}, 'load', vi.fn(), vi.fn(), vi.fn(), 'test_slug', vi.fn());
    expect(readFileFromGCS).toHaveBeenCalledWith(node);
    expect(result.merge).toEqual(mergeData);
  });

  it('clears gcs_path if readFileFromGCS throws an error', async () => {
    node.data.gcs_path = 'gs://bucket/path/report.json';
    vi.mocked(readFileFromGCS).mockRejectedValue(new Error('GCS read error'));
    await node.compute({}, 'load', vi.fn(), vi.fn(), vi.fn(), 'test_slug', vi.fn());
    expect(node.data.gcs_path).toEqual('');
  });

  it('sets message if merge and csv data are present', async () => {
    await node.compute(
      {
        merge: mergeData,
        csv: csvData
      },
      'run',
      vi.fn(),
      vi.fn(),
      vi.fn(),
      'test_slug',
      vi.fn()
    );
    expect(node.data.message).toContain(`clusters: ${mergeData.topics.length}`);
    expect(node.data.message).toContain(`csv: ${csvData.length}`);
  });

  it('sets message to empty string if merge or csv data are missing', async () => {
    await node.compute(
      { merge: mergeData },
      'run',
      vi.fn(),
      vi.fn(),
      vi.fn(),
      'test_slug',
      vi.fn()
    );
    expect(node.data.message).toEqual('');
  });

  it('does not mutate the input node', async () => {
    const originalNodeData = deepCopy(report_node_data);
    await node.compute(
      {
        merge: mergeData,
        csv: csvData
      },
      'run',
      vi.fn(),
      vi.fn(),
      vi.fn(),
      'test_slug',
      vi.fn()
    );
    expect(node.id).toEqual(originalNodeData.id);
    expect(node.type).toEqual(originalNodeData.type);
    expect(node.position).toEqual(originalNodeData.position);
  });
});
