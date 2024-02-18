import MergeClusterExtractionNode, {
  merge_cluster_extraction_node_data
} from '$lib/compute/merge_cluster_extraction_v0';
import deepCopy from 'deep-copy';
import { describe, it, vi } from 'vitest';
import { expect } from 'vitest';
import mock_cluster_extraction_data from '$lib/mock_data/cluster_extraction/cluster_extraction.json';
import mock_cluster_extraction_data_2 from '$lib/mock_data/cluster_extraction/cluster_extraction_2.json';
import mock_merged_cluster_extraction_data from '$lib/mock_data/cluster_extraction/merged_cluster_extraction.json';
import csv_data from '$lib/mock_data/csv/csv.json';

vi.mock('$lib/utils', () => ({
  readFileFromGCS: vi.fn(() =>
    Promise.resolve(JSON.stringify(mock_merged_cluster_extraction_data))
  ),
  uploadJSONToGCS: vi.fn(() => Promise.resolve())
}));

describe('MergeClusterExtractionNode class', () => {
  it('merges cluster extraction data', async () => {
    const node = new MergeClusterExtractionNode(deepCopy(merge_cluster_extraction_node_data));
    node.data.input_ids.open_ai_key = 'open_ai_key';
    node.data.input_ids.csv = 'csv';

    node.data.prompt = 'Merge the following cluster extractions: {clusters}';
    node.data.system_prompt = 'You are a professional research assistant.';
    const inputData = {
      open_ai_key: 'sk-aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      csv: csv_data,
      cluster_extraction_1: mock_cluster_extraction_data,
      cluster_extraction_2: mock_cluster_extraction_data_2
    };
    const output = await node.compute(
      inputData,
      'run',
      console.log,
      console.error,
      console.log,
      'test_slug'
    );
    expect(output).toBeInstanceOf(Object);
    expect(output).toHaveProperty('topics');
    expect(output).toEqual(mock_merged_cluster_extraction_data);
  });

  it('does not merge if cluster extractions are missing', async () => {
    const node = new MergeClusterExtractionNode(deepCopy(merge_cluster_extraction_node_data));
    node.data.prompt = 'Merge the following cluster extractions: {clusters}';
    node.data.system_prompt = 'You are a professional research assistant.';
    const inputData = {
      open_ai_key: 'sk-aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      csv: csv_data
    };
    const output = await node.compute(
      inputData,
      'run',
      console.log,
      console.error,
      console.log,
      'test_slug'
    );
    expect(output).toBeInstanceOf(Object);
  });

  it('uses cached data if available and not dirty', async () => {
    const node = new MergeClusterExtractionNode(deepCopy(merge_cluster_extraction_node_data));
    node.data.gcs_path = 'gs://test_bucket/test_path';
    node.data.dirty = false;
    node.data.num_cluster_extractions = 2;
    node.data.input_ids.open_ai_key = 'open_ai_key';
    node.data.input_ids.csv = 'csv';
    const inputData = {
      open_ai_key: 'sk-aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      csv: csv_data,
      cluster_extraction_1: mock_cluster_extraction_data,
      cluster_extraction_2: mock_cluster_extraction_data_2
    };
    const output = await node.compute(
      inputData,
      'run',
      console.log,
      console.error,
      console.log,
      'test_slug'
    );
    expect(output).toEqual(mock_merged_cluster_extraction_data);
  });

  it('does not merge if no open_ai_key is provided', async () => {
    const node = new MergeClusterExtractionNode(deepCopy(merge_cluster_extraction_node_data));
    node.data.prompt = 'Merge the following cluster extractions: {clusters}';
    node.data.system_prompt = 'You are a professional research assistant.';
    node.data.input_ids.open_ai_key = 'open_ai_key';
    node.data.input_ids.csv = 'csv';
    const inputData = {
      csv: csv_data,
      cluster_extraction_1: mock_cluster_extraction_data,
      cluster_extraction_2: mock_cluster_extraction_data_2
    };
    const output = await node.compute(
      inputData,
      'run',
      console.log,
      console.error,
      console.log,
      'test_slug'
    );
    expect(output).toBeUndefined();
  });
});
