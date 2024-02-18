import { describe, it, expect, beforeEach } from 'vitest';
import TextToCSV, { text_to_csv_node_data } from '$lib/compute/text_to_csv_v0';
import deepCopy from 'deep-copy';

describe('TextToCSV class', () => {
  let node;
  let inputData;
  const timeout = 60000;

  beforeEach(() => {
    node = new TextToCSV(deepCopy(text_to_csv_node_data));
    inputData = {
      text1:
        'This is a test comment that should be split into chunks based on the specified number of tokens.',
      text2: ['Another test comment that will be split.', 'And yet another one, for good measure.']
    };
  }, timeout);

  it(
    'should convert a single text input to CSV format',
    async () => {
      const output = await node.compute(
        { text1: inputData.text1 },
        'run',
        console.log,
        console.error,
        console.log,
        'test_slug',
        null
      );

      expect(output).toEqual([
        {
          'comment-body':
            'This is a test comment that should be split into chunks based on the specified number of tokens.',
          'comment-id': '0',
          interview: 'Alice',
          video: 'https://www.youtube.com/watch?v=1qKz9W3bKbE',
          timestamp: '00:00:00'
        }
      ]);
    },
    timeout
  );

  it(
    'should convert multiple text inputs to CSV format',
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

      expect(output).toEqual([
        {
          'comment-body':
            'This is a test comment that should be split into chunks based on the specified number of tokens.',
          'comment-id': '0',
          interview: 'Alice',
          video: 'https://www.youtube.com/watch?v=1qKz9W3bKbE',
          timestamp: '00:00:00'
        },
        {
          'comment-body': 'Another test comment that will be split.',
          'comment-id': '1',
          interview: 'Alice',
          video: 'https://www.youtube.com/watch?v=1qKz9W3bKbE',
          timestamp: '00:00:00'
        },
        {
          'comment-body': 'And yet another one, for good measure.',
          'comment-id': '2',
          interview: 'Alice',
          video: 'https://www.youtube.com/watch?v=1qKz9W3bKbE',
          timestamp: '00:00:00'
        }
      ]);
    },
    timeout
  );

  it(
    'should handle empty text input',
    async () => {
      const output = await node.compute(
        { text1: '' },
        'run',
        console.log,
        console.error,
        console.log,
        'test_slug',
        null
      );

      expect(output).toEqual([]);
    },
    timeout
  );

  it(
    'should split text into chunks if it exceeds the number of tokens',
    async () => {
      node.data.numTokens = '10'; // Set a small number of tokens to force splitting
      const longText =
        'This is a very long test comment that will definitely be split into multiple chunks because it exceeds the token limit.';
      const output = await node.compute(
        { text1: longText },
        'run',
        console.log,
        console.error,
        console.log,
        'test_slug',
        null
      );

      expect(output.length).toBeGreaterThan(1);
      expect(output[0]['comment-body']).not.toEqual(longText);
      expect(output.reduce((acc, doc) => acc + doc['comment-body'], '')).toEqual(longText);
    },
    timeout
  );
});
