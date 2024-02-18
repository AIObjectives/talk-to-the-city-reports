import { describe, it, vi, expect, beforeEach } from 'vitest';
import SummarizeNode, { summarize_node_data } from '$lib/compute/summarize_v0';
import deepCopy from 'deep-copy';

describe('SummarizeNode class', () => {
  let node;
  let inputData;
  const timeout = 60000;

  beforeEach(() => {
    vi.mock('$lib/utils', () => ({
      readFileFromGCS: vi.fn(() => Promise.resolve(JSON.stringify({}))),
      uploadJSONToGCS: vi.fn(() => Promise.resolve())
    }));

    vi.mock('$lib/gpt', () => ({
      default: vi.fn(() => Promise.resolve('Summary text'))
    }));

    node = new SummarizeNode(deepCopy(summarize_node_data));
    inputData = {
      open_ai_key: 'sk-aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      data: {
        topics: [
          {
            topicName: 'Weather',
            subtopics: [
              {
                subtopicName: 'Current Conditions',
                claims: [{ quote: 'The weather is sunny.' }, { quote: 'It is a warm day.' }]
              }
            ]
          }
        ]
      }
    };
  }, timeout);

  it(
    'should generate summaries for topics and subtopics',
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
            topicShortDescription: 'Summary text',
            subtopics: [
              {
                subtopicName: 'Current Conditions',
                subtopicShortDescription: 'Summary text',
                claims: [{ quote: 'The weather is sunny.' }, { quote: 'It is a warm day.' }]
              }
            ]
          }
        ]
      });
    },
    timeout
  );

  it(
    'should load summaries from GCS if data length matches',
    async () => {
      node.data.length = node.length(inputData.data);
      node.data.gcs_path = 'gs://test_bucket/test_path';

      const output = await node.compute(
        inputData,
        'run',
        console.log,
        console.error,
        console.log,
        'test_slug',
        null
      );

      expect(output).toEqual(inputData.data);
    },
    timeout
  );
});
