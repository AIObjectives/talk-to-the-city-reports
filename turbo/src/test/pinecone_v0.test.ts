import { describe, it, vi, expect, beforeEach } from 'vitest';
import { getDataset } from './test/mocks/dataset';

describe('PineconeNode class', () => {
  let node;
  let inputData;
  let dataset;
  const timeout = 60000;

  beforeEach(() => {
    vi.mock('@pinecone-database/pinecone', () => ({
      Pinecone: vi.fn().mockImplementation(() => ({
        deleteIndex: vi.fn().mockResolvedValue({}),
        describeIndex: vi.fn().mockRejectedValue(new Error('Index not found')),
        createIndex: vi.fn().mockResolvedValue({}),
        index: vi.fn().mockReturnValue({
          namespace: vi.fn().mockReturnValue({
            upsert: vi.fn().mockResolvedValue({}),
            query: vi.fn().mockResolvedValue({
              matches: [
                { id: 'claim1', score: 0.9 },
                { id: 'claim2', score: 0.8 }
              ]
            })
          })
        }),
        listIndexes: vi.fn().mockResolvedValue(['test-index'])
      }))
    }));

    dataset = getDataset();
    node = dataset.graph.findImpl('pinecone');
    inputData = {
      embeddings: [{ id: 'embedding1', values: [0.1, 0.2, 0.3] }],
      pinecone_api_key: 'pinecone_api_key'
    };
  }, timeout);

  it(
    'should initialize Pinecone with the provided API key',
    async () => {
      await node.compute(
        inputData,
        'run',
        console.log,
        console.error,
        console.log,
        'test_slug',
        null,
        dataset
      );
      expect(node.pc).toBeDefined();
    },
    timeout
  );

  it(
    'should create a new index if it does not exist and upsert embeddings',
    async () => {
      await node.compute(
        inputData,
        'run',
        console.log,
        console.error,
        console.log,
        'test_slug',
        null,
        dataset
      );
      expect(node.pc.createIndex).toHaveBeenCalled();
      expect(node.pc.index().namespace('comments').upsert).toHaveBeenCalledWith(
        inputData.embeddings
      );
    },
    timeout
  );

  // Todo: this should be implemented with a mock embeddings node
  // it(
  //   'should query Pinecone index and return nearest neighbors',
  //   async () => {
  //     const term = 'test search term';
  //     const topK = 2;
  //     const results = await node.query_pinecone(term, topK, dataset);
  //     expect(results).toEqual([
  //       { claim: 'claim1', score: 0.9 },
  //       { claim: 'claim2', score: 0.8 }
  //     ]);
  //   },
  //   timeout
  // );

  it(
    'should list Pinecone indexes',
    async () => {
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
      expect(output.indexes).toEqual(['test-index']);
    },
    timeout
  );

  it(
    'should provide tools for querying Pinecone index',
    async () => {
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
      expect(output.tools).toBeDefined();
      expect(output.tools[0].function.name).toBe('query_pinecone');
    },
    timeout
  );
});
