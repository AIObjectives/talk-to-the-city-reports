import ScoreArgumentRelevanceNode, {
  score_argument_relevance_node_data
} from '$lib/compute/score_argument_relevance_v0';
import deepCopy from 'deep-copy';
import { describe, it, vi } from 'vitest';
import { expect } from 'vitest';
import mock_argument_extraction_data from '$lib/mock_data/argument_extraction/argument_extraction.json';
import { score_claim_relevance_prompt } from '$lib/prompts';
import scored_arguments from '$lib/mock_data/cluster_extraction/scored_arguments.json';

vi.mock('$lib/utils', () => ({
  readFileFromGCS: vi.fn(() => Promise.resolve(JSON.stringify(mock_argument_extraction_data))),
  uploadJSONToGCS: vi.fn(() => Promise.resolve())
}));

describe('ScoreArgumentRelevanceNode class', () => {
  it('scores the relevance of arguments', async () => {
    const node = new ScoreArgumentRelevanceNode(deepCopy(score_argument_relevance_node_data));
    node.data.prompt = score_claim_relevance_prompt;
    const inputData = {
      open_ai_key: 'sk-aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      argument_extraction: mock_argument_extraction_data
    };
    const output = await node.compute(
      inputData,
      'run',
      console.log,
      console.error,
      console.log,
      'test_slug'
    );
    expect(output).toEqual(scored_arguments);
  });

  it('uses cached data if available and not dirty', async () => {
    const node = new ScoreArgumentRelevanceNode(deepCopy(score_argument_relevance_node_data));
    node.data.gcs_path = 'gs://test_bucket/test_path';
    node.data.csv_length = Object.keys(mock_argument_extraction_data).length;
    node.data.dirty = false;
    const inputData = {
      open_ai_key: 'sk-aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      argument_extraction: mock_argument_extraction_data
    };
    const output = await node.compute(
      inputData,
      'run',
      console.log,
      console.error,
      console.log,
      'test_slug'
    );
    expect(output).toEqual(mock_argument_extraction_data);
  });

  it('does not score if argument_extraction data is missing', async () => {
    const node = new ScoreArgumentRelevanceNode(deepCopy(score_argument_relevance_node_data));
    const inputData = {
      open_ai_key: 'sk-aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
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

  it('does not score if open_ai_key is missing', async () => {
    const node = new ScoreArgumentRelevanceNode(deepCopy(score_argument_relevance_node_data));
    const inputData = {
      argument_extraction: mock_argument_extraction_data
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

  it('does not score if prompts are missing', async () => {
    const node = new ScoreArgumentRelevanceNode(deepCopy(score_argument_relevance_node_data));
    node.data.prompt = undefined;
    node.data.system_prompt = undefined;
    const inputData = {
      open_ai_key: 'sk-aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      argument_extraction: mock_argument_extraction_data
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
