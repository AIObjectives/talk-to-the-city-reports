import GPTNode, { gpt_node_data } from '$lib/compute/gpt_v0';
import deepCopy from 'deep-copy';
import { describe, it, vi, beforeEach } from 'vitest';
import { expect } from 'vitest';

const json_prompt = `\
Please write a first hand 10 word account of living conditions in any city of your choice.

Respond with JSON:

{
    "response": <string>,
}`;

const json_prompt_with_text = `\
Please write a first hand 10 word account of living conditions in any city of your choice.

Here is a city: {text}

Respond with JSON:

{
    "response": <string>,
}`;

describe('GPTNode class', function () {
  const timeout = 60000;

  it(
    'general prompt',
    async () => {
      vi.mock('$lib/utils', () => ({
        readFileFromGCS: vi.fn(() => Promise.resolve()),
        uploadJSONToGCS: vi.fn(() => Promise.resolve())
      }));

      const node = new GPTNode(deepCopy(gpt_node_data));
      const inputData = {
        open_ai_key: 'sk-aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
      };

      const output = await node.compute(
        inputData,
        'run',
        console.log,
        console.error,
        console.log,
        'test_slug',
        null
      );
      expect(output).toEqual(
        'New York City: Bustling, crowded, diverse, expensive, vibrant, noisy, ever-changing.'
      );
    },
    timeout
  );

  it(
    'json prompt',
    async () => {
      vi.mock('$lib/utils', () => ({
        readFileFromGCS: vi.fn(() => Promise.resolve()),
        uploadJSONToGCS: vi.fn(() => Promise.resolve())
      }));

      const node = new GPTNode(deepCopy(gpt_node_data));
      node.data.prompt = json_prompt;
      node.data.response_format = { type: 'json_object' };
      const inputData = {
        open_ai_key: 'sk-aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
      };

      const output = await node.compute(
        inputData,
        'run',
        console.log,
        console.error,
        console.log,
        'test_slug',
        null
      );
      expect(output).toEqual(
        `{
  "response": "New York: Bustling, crowded, diverse, expensive, vibrant, with limited space."
}`
      );
    },
    timeout
  );

  it(
    'json prompt with text',
    async () => {
      vi.mock('$lib/utils', () => ({
        readFileFromGCS: vi.fn(() => Promise.resolve()),
        uploadJSONToGCS: vi.fn(() => Promise.resolve())
      }));

      const node = new GPTNode(deepCopy(gpt_node_data));
      node.data.prompt = json_prompt_with_text;
      node.data.response_format = { type: 'json_object' };
      const inputData = {
        open_ai_key: 'sk-aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        text: 'Taipei'
      };

      const output = await node.compute(
        inputData,
        'run',
        console.log,
        console.error,
        console.log,
        'test_slug',
        null
      );
      expect(output).toEqual(
        `{
  "response": "Taipei offers vibrant culture, convenience, but also dense living spaces."
}`
      );
    },
    timeout
  );
});
