import { describe, it, vi, expect, beforeEach } from 'vitest';
import MergeClusterExtractionNode, {
  merge_cluster_extraction_node_data
} from '$lib/compute/merge_cluster_extraction_v1';
import deepCopy from 'deep-copy';

describe('MergeClusterExtractionNode class', () => {
  let node;
  let inputData;
  const timeout = 60000;

  beforeEach(() => {
    vi.mock('$lib/utils', () => ({
      readFileFromGCS: vi.fn(() => Promise.resolve()),
      uploadJSONToGCS: vi.fn(() => Promise.resolve())
    }));

    node = new MergeClusterExtractionNode(deepCopy(merge_cluster_extraction_node_data));
    node.data.input_ids.csv = 'csv';
    node.data.input_ids.open_ai_key = 'open_ai_key';
    inputData = {
      open_ai_key: 'sk-aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      csv: [
        {
          topics: [
            {
              topicName: 'Weather',
              subtopics: ['Current Conditions']
            }
          ]
        },
        {
          topics: [
            {
              topicName: 'Weather',
              subtopics: ['Precipitation Duration']
            }
          ]
        }
      ]
    };
  }, timeout);

  it(
    'should merge cluster extractions into a single output',
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
      expect(output).toEqual({
        topics: [
          {
            topicName: 'Weather',
            subtopics: ['Current Conditions', 'Precipitation Duration']
          }
        ]
      });
      console.log(JSON.stringify(output, null, 2));
    },
    timeout
  );

  it(
    'should handle empty input data',
    async () => {
      inputData.csv = [];
      const output = await node.compute(
        inputData,
        'run',
        console.log,
        console.error,
        console.log,
        'test_slug',
        null
      );

      expect(output).toBeUndefined();
    },
    timeout
  );

  it(
    'should not process if no open_ai_key is provided',
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

      expect(output).toBeUndefined();
    },
    timeout
  );
});
