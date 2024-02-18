import ClusterExtractionNode, {
  cluster_extraction_node_data_v1
} from '$lib/compute/cluster_extraction_v1';
import deepCopy from 'deep-copy';
import { describe, it, vi, beforeEach } from 'vitest';
import { expect } from 'vitest';
import mock_cluster_extraction_data from '$lib/mock_data/cluster_extraction/cluster_extraction.json';
import csv_data from '$lib/mock_data/csv/csv.json';
import prompt from '$lib/mock_data/cluster_extraction/prompt.txt?raw';
import system_prompt from '$lib/mock_data/cluster_extraction/system_prompt.txt?raw';
import { format, unwrapFunctionStore } from 'svelte-i18n';

const $__ = unwrapFunctionStore(format);

vi.mock('$lib/utils', () => ({
  readFileFromGCS: vi.fn(() => Promise.resolve(JSON.stringify(mock_cluster_extraction_data))),
  uploadJSONToGCS: vi.fn(() => Promise.resolve())
}));

describe('ClusterExtractionNode class', () => {
  let node;
  let inputData;
  const timeout = 60000;

  beforeEach(() => {
    node = new ClusterExtractionNode(deepCopy(cluster_extraction_node_data_v1));
    inputData = {
      open_ai_key: 'sk-aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      csv: csv_data
    };
    node.data.prompt = prompt;
    node.data.system_prompt = system_prompt;
    node.data.prompt_suffix = '';
    node.data.response_format = { type: 'verbose_json' };
  }, timeout);

  it(
    'extract the cluster',
    async () => {
      const output = await node.compute(
        inputData,
        'run',
        console.log,
        console.error,
        console.log,
        'test_slug',
        null
      );
      expect(output).toEqual(mock_cluster_extraction_data);
      expect(node.data.message).toEqual(`topics: 2 subtopics: 2.`);
    },
    timeout
  );

  it(
    'should not extract the cluster if no csv',
    async () => {
      delete inputData.csv;
      const output = await node.compute(
        inputData,
        'run',
        console.log,
        console.error,
        console.log,
        'test_slug',
        null
      );
      expect(output).toEqual(undefined);
      expect(node.data.message).toEqual(`missing_input_data`);
    },
    timeout
  );

  it(
    'should not extract the cluster if no open_ai_key',
    async () => {
      delete inputData.open_ai_key;
      const output = await node.compute(
        inputData,
        'run',
        console.log,
        console.error,
        console.log,
        'test_slug',
        null
      );
      expect(output).toEqual(undefined);
      expect(node.data.message).toEqual(`missing_input_data`);
    },
    timeout
  );

  it(
    'should not extract the cluster if no prompt and no system prompt',
    async () => {
      node.data.system_prompt = undefined;
      node.data.prompt = undefined;
      const output = await node.compute(
        inputData,
        'run',
        console.log,
        console.error,
        console.log,
        'test_slug',
        null
      );
      expect(output).toEqual(undefined);
      expect(node.data.message).toEqual(`missing_input_data`);
    },
    timeout
  );

  it(
    'test GCS caching',
    async () => {
      node.data.gcs_path = 'gs://test_bucket/test_path';
      node.data.dirty = false;
      node.data.csv_length = csv_data.length;
      const output = await node.compute(
        inputData,
        'run',
        (x) => {
          console.log(x);
          expect(x == 'Calling OpenAI').toEqual(false);
        },
        console.error,
        console.log,
        'test_slug',
        null
      );
      expect(output).toEqual(mock_cluster_extraction_data);
      expect(node.data.message).toEqual(`loaded_from_gcs. topics: 2 subtopics: 2.`);
    },
    timeout
  );
});
