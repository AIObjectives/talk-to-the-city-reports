import ArgumentExtractionNode, {
  argument_extraction_node_data_v1
} from '$lib/compute/argument_extraction_v1';
import deepCopy from 'deep-copy';
import { describe, it, vi, beforeEach } from 'vitest';
import { expect } from 'vitest';
import mock_argument_extraction_data from '$lib/mock_data/argument_extraction/argument_extraction.json';
import mock_cluster_extraction_data from '$lib/mock_data/cluster_extraction/cluster_extraction.json';
import csv_data from '$lib/mock_data/csv/csv.json';
import csv_data_missing_rows from '$lib/mock_data/csv/csv_missing_rows.json';
import prompt from '$lib/mock_data/argument_extraction/v1/prompt.txt?raw';
import prompt_suffix from '$lib/mock_data/argument_extraction/v1/prompt_suffix.txt?raw';
import system_prompt from '$lib/mock_data/argument_extraction/system_prompt.txt?raw';

vi.mock('$lib/utils', () => ({
  readFileFromGCS: vi.fn(() => Promise.resolve(JSON.stringify(mock_argument_extraction_data))),
  uploadJSONToGCS: vi.fn(() => Promise.resolve())
}));

describe('ArgumentExtractionNode class', function () {
  let node;
  let inputData;
  const timeout = 60000;

  beforeEach(() => {
    node = new ArgumentExtractionNode(deepCopy(argument_extraction_node_data_v1));
    inputData = {
      open_ai_key: 'sk-aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      csv: csv_data,
      cluster_extraction: mock_cluster_extraction_data
    };
    node.data.prompt = prompt;
    node.data.prompt_suffix = prompt_suffix;
    node.data.system_prompt = system_prompt;
  }, timeout);

  it(
    'extract the given arguments',
    async () => {
      const output = await node.compute(
        inputData,
        'run',
        console.log,
        console.error,
        console.log,
        'test_slug'
      );
      expect(output).toEqual(mock_argument_extraction_data);
      expect(node.data.message).toEqual(`comments: 2 claims: 2.`);
    },
    timeout
  );

  it(
    'extract the given arguments with missing rows in CSV',
    async () => {
      const output = await node.compute(
        {
          open_ai_key: 'sk-aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
          csv: csv_data_missing_rows,
          cluster_extraction: mock_cluster_extraction_data
        },
        'run',
        console.log,
        console.error,
        console.log,
        'test_slug'
      );
      expect(output).toEqual(mock_argument_extraction_data);
      expect(node.data.message).toEqual(`comments: 2 claims: 2.`);
    },
    timeout
  );

  it(
    'should not extract the arguments if no csv',
    async () => {
      delete inputData.csv;
      const output = await node.compute(
        inputData,
        'run',
        console.log,
        console.error,
        console.log,
        'test_slug'
      );
      expect(output).toEqual(undefined);
      expect(node.data.message).toEqual(`missing_input_data`);
    },
    timeout
  );

  it(
    'should not extract the arguments if no open_ai_key and no GCS',
    async () => {
      delete inputData.open_ai_key;
      const output = await node.compute(
        inputData,
        'run',
        console.log,
        console.error,
        console.log,
        'test_slug'
      );
      expect(output).toEqual(undefined);
      expect(node.data.message).toEqual(`missing_input_data`);
    },
    timeout
  );

  it(
    'should load from GCS if no open ai key',
    async () => {
      delete inputData.open_ai_key;
      node.data.gcs_path = 'gs://test_bucket/test_path';
      node.data.csv_length = csv_data.length;
      const output = await node.compute(
        inputData,
        'run',
        console.log,
        console.error,
        console.log,
        'test_slug'
      );
      expect(output).toEqual(mock_argument_extraction_data);
      expect(node.data.message).toEqual(`loaded_from_gcs. comments: 2 claims: 2.`);
    },
    timeout
  );

  it(
    'should not extract the arguments if no prompt and no system prompt',
    async () => {
      node.data.system_prompt = undefined;
      node.data.prompt = undefined;
      const output = await node.compute(
        inputData,
        'run',
        console.log,
        console.error,
        console.log,
        'test_slug'
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
        'test_slug'
      );
      expect(output).toEqual(mock_argument_extraction_data);
      expect(node.data.message).toEqual(`loaded_from_gcs. comments: 2 claims: 2.`);
    },
    timeout
  );
});
