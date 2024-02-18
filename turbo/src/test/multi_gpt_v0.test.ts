import { describe, it, vi, expect, beforeEach } from 'vitest';
import MultiGPTNode, { multi_gpt_node_data } from '$lib/compute/multi_gpt_v0';
import { gpt_v0_prompt, gpt_v0_prompt_1, gpt_v0_prompt_2 } from '$lib/prompts';
import deepCopy from 'deep-copy';

describe('MultiGPTNode class', () => {
  let node;
  let inputData;
  const timeout = 60000;

  beforeEach(() => {
    vi.mock('$lib/utils', () => ({
      readFileFromGCS: vi.fn(() => Promise.resolve()),
      uploadJSONToGCS: vi.fn(() => Promise.resolve())
    }));

    node = new MultiGPTNode(deepCopy(multi_gpt_node_data));
    node.data.input_ids.prompts = 'prompts';
    node.data.input_ids.open_ai_key = 'open_ai_key';
    inputData = {
      open_ai_key: 'sk-aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      prompts: [gpt_v0_prompt, gpt_v0_prompt]
    };
  }, timeout);

  it(
    'should process multiple prompts',
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
        'New York City: Bustling, crowded, diverse, expensive, vibrant, noisy, ever-changing.',
        'New York City: Bustling, crowded, diverse, expensive, vibrant, noisy, ever-changing.'
      ]);
    },
    timeout
  );

  it(
    'should process multiple differing prompts',
    async () => {
      inputData = {
        open_ai_key: 'sk-aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        prompts: [gpt_v0_prompt_1, gpt_v0_prompt_2]
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
      expect(output).toEqual([
        'Crowded streets, vibrant markets, high-rise apartments, diverse, rich culture.',
        'Clean, efficient public transport, expensive rent, historic, culturally vibrant, safe.'
      ]);
    },
    timeout
  );

  it(
    'should join outputs if join_output is true',
    async () => {
      inputData = {
        open_ai_key: 'sk-aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        prompts: [gpt_v0_prompt_1, gpt_v0_prompt_2]
      };
      node.data.join_output = true;
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
        'Crowded streets, vibrant markets, high-rise apartments, diverse, rich culture. Clean, efficient public transport, expensive rent, historic, culturally vibrant, safe.'
      );
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

      expect(output).toEqual([undefined, undefined]);
    },
    timeout
  );
});
