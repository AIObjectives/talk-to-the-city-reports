import { vi, describe, it, expect, beforeEach } from 'vitest';
import MultiClusterExtractionNode, {
  multi_cluster_extraction_node_data
} from '$lib/compute/multi_cluster_extraction_v0';
import deepCopy from 'deep-copy';
import csv_data from '$lib/mock_data/csv/csv.json';
import _ from 'lodash';
import { getEncoding } from 'js-tiktoken';
const encoding = getEncoding('cl100k_base');

describe('MultiClusterExtractionNode class', () => {
  let node;
  let inputData;
  const timeout = 60000;

  beforeEach(() => {
    node = new MultiClusterExtractionNode(deepCopy(multi_cluster_extraction_node_data));
    inputData = {
      open_ai_key: 'sk-aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      csv: csv_data
    };
  }, timeout);

  it(
    'should split CSV into chunks and process each chunk',
    async () => {
      vi.mock('$lib/utils', () => ({
        readFileFromGCS: vi.fn(() => Promise.resolve()),
        uploadJSONToGCS: vi.fn(() => Promise.resolve())
      }));

      node.data.context_limit = 6;
      let expectedNumTokens = 0;
      _.forEach(csv_data, (csv) => {
        expectedNumTokens += encoding.encode(csv['comment-body']).length;
      });
      expect(expectedNumTokens).toEqual(12);
      const expectedNumChunks = Math.ceil(expectedNumTokens / node.data.context_limit);
      expect(expectedNumChunks).toEqual(2);

      const output = await node.compute(
        inputData,
        'run',
        console.log,
        console.error,
        console.log,
        'test_slug',
        null
      );

      expect(node.data.num_tokens).toEqual(expectedNumTokens);
      expect(node.data.num_chunks).toEqual(expectedNumChunks);
      expect(output).toEqual([
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
      ]);
    },
    timeout
  );

  it(
    'should handle empty CSV input',
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

      expect(node.data.num_tokens).toEqual(0);
      expect(node.data.num_chunks).toEqual(0);
      expect(output).toEqual([]);
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

      expect(output).toEqual([undefined]);
    },
    timeout
  );
});
