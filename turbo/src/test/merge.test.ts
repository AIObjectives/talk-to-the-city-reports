import { describe, it } from 'vitest';
import { expect } from 'vitest';
import MergeNode, { merge_node_data } from '$lib/compute/merge_v0';
import deepCopy from 'deep-copy';
import mock_cluster_extraction_data from '$lib/mock_data/cluster_extraction/cluster_extraction.json';
import mock_argument_extraction_data from '$lib/mock_data/argument_extraction/argument_extraction.json';

describe('MergeNode class', () => {
  it('merges cluster_extraction and argument_extraction data', async () => {
    const node = new MergeNode(deepCopy(merge_node_data));
    const inputData = {
      cluster_extraction: mock_cluster_extraction_data,
      argument_extraction: mock_argument_extraction_data
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
    expect(output).toHaveProperty('topics');
    expect(output.topics).toBeInstanceOf(Array);
    output.topics.forEach((topic) => {
      expect(topic).toHaveProperty('subtopics');
      topic.subtopics.forEach((subtopic) => {
        expect(subtopic).toHaveProperty('claims');
        expect(subtopic.claims).toBeInstanceOf(Array);
      });
    });
  });

  it('does not merge if cluster_extraction data is missing', async () => {
    const node = new MergeNode(deepCopy(merge_node_data));
    const inputData = {
      argument_extraction: mock_argument_extraction_data
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
    expect(output).toBeUndefined();
  });

  it('does not merge if argument_extraction data is missing', async () => {
    const node = new MergeNode(deepCopy(merge_node_data));
    const inputData = {
      cluster_extraction: mock_cluster_extraction_data
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
    expect(output).toBeUndefined();
  });

  it('does not merge if cluster_extraction data has no topics', async () => {
    const node = new MergeNode(deepCopy(merge_node_data));
    const inputData = {
      cluster_extraction: { ...mock_cluster_extraction_data, topics: undefined },
      argument_extraction: mock_argument_extraction_data
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
    expect(output).toBeUndefined();
  });

  it('sets node data output to the merged data and dirty to false after merge', async () => {
    const node = new MergeNode(deepCopy(merge_node_data));
    const inputData = {
      cluster_extraction: mock_cluster_extraction_data,
      argument_extraction: mock_argument_extraction_data
    };
    await node.compute(
      inputData,
      'run',
      console.log,
      console.error,
      console.log,
      'test_slug',
      null
    );
    expect(node.data.output).toHaveProperty('topics');
    expect(node.data.dirty).toBe(false);
  });
});
