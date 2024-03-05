import { describe, it, vi, expect, beforeEach } from 'vitest';
import GPTEmbeddingsNode, { gpt_embeddings_node_data } from '$lib/compute/gpt_embeddings_v0';
import deepCopy from 'deep-copy';
import { getDataset } from './test/mocks/dataset';

describe('GPTEmbeddingsNode class', () => {
  let node;
  let inputData;
  const timeout = 60000;
  const dataset = getDataset();
  const mockEmbedding = [0.1, 0.2, 0.3, 0.4, 0.5];

  beforeEach(() => {
    vi.mock('openai', () => ({
      default: vi.fn().mockImplementation(() => ({
        embeddings: {
          create: vi.fn().mockResolvedValue({
            data: [{ embedding: [0.1, 0.2, 0.3, 0.4, 0.5] }]
          })
        }
      }))
    }));

    node = new GPTEmbeddingsNode(deepCopy(gpt_embeddings_node_data));
    inputData = {
      open_ai_key: 'test_open_ai_key',
      data: [{ claim: 'The sky is blue.' }, { claim: 'Grass is green.' }]
    };
  }, timeout);

  it(
    'should compute embeddings for input data',
    async () => {
      vi.mock('$lib/utils', () => ({
        readFileFromGCS: vi.fn(() =>
          Promise.resolve(JSON.stringify([{ embedding: [0.1, 0.2, 0.3, 0.4, 0.5] }]))
        ),
        uploadJSONToGCS: vi.fn(() => Promise.resolve())
      }));
      const output = await node.compute(
        inputData,
        'run',
        console.log,
        console.error,
        console.log,
        'test_slug',
        null,
        dataset
      );
      expect(output).toEqual({
        embeddings: [
          { values: mockEmbedding, id: 'The sky is blue.' },
          { values: mockEmbedding, id: 'Grass is green.' }
        ]
      });
      expect(node.data.length).toEqual(2);
      expect(node.data.message).toContain('computed_embeddings');
    },
    timeout
  );

  it(
    'should not compute embeddings if no open_ai_key is provided',
    async () => {
      delete inputData.open_ai_key;
      const output = await node.compute(
        inputData,
        'run',
        console.log,
        console.error,
        console.log,
        'test_slug',
        null,
        dataset
      );

      expect(output).toBeUndefined();
    },
    timeout
  );

  it(
    'should load embeddings from GCS if data length matches and save_to_gcs is true',
    async () => {
      vi.mock('$lib/utils', () => ({
        readFileFromGCS: vi.fn(() =>
          Promise.resolve(
            JSON.stringify([
              { values: [0.1, 0.2, 0.3, 0.4, 0.5], id: 'The sky is blue.' },
              { values: [0.1, 0.2, 0.3, 0.4, 0.5], id: 'Grass is green.' }
            ])
          )
        ),
        uploadJSONToGCS: vi.fn(() => Promise.resolve())
      }));

      node.data.length = 2;
      node.data.save_to_gcs = true;
      node.data.gcs_path = 'gs://test_bucket/test_path';

      const output = await node.compute(
        inputData,
        'run',
        console.log,
        console.error,
        console.log,
        'test_slug',
        null,
        dataset
      );

      expect(output).toEqual({
        embeddings: [
          { values: mockEmbedding, id: 'The sky is blue.' },
          { values: mockEmbedding, id: 'Grass is green.' }
        ]
      });
      expect(node.data.message).toContain('loaded_from_gcs');
    },
    timeout
  );

  it(
    'should handle no data input',
    async () => {
      inputData.data = undefined;
      const output = await node.compute(
        inputData,
        'run',
        console.log,
        console.error,
        console.log,
        'test_slug',
        null,
        dataset
      );

      expect(output).toBeUndefined();
      expect(node.data.message).toContain('no_data');
    },
    timeout
  );
});
