// stock
import { describe, it, vi, beforeEach } from 'vitest';
import { expect } from 'vitest';

// data
import weather from '$lib/mock_data/csv/csv.csv?raw';
import mock_cluster_extraction_data from '$lib/mock_data/cluster_extraction/cluster_extraction.json';
import mock_argument_extraction_data from '$lib/mock_data/argument_extraction/argument_extraction.json';
import mock_merge_data from '$lib/mock_data/merge/merge.json';

// utilities
import * as utils from '$lib/utils';

// graph
import { getDataset, getSimpleDataset, getMarkdownToChatDataset } from './test/mocks/dataset';

describe('Full pipeline run test', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });
  it('Find by compute type', async () => {
    const dataset = getSimpleDataset();
    const nodes = dataset.graph.findByComputeType('markdown_v0');
    expect(nodes[0].node.data.compute_type).toEqual('markdown_v0');
  });
  it('Simple pipeline run test', async () => {
    const dataset = getSimpleDataset();
    await dataset.processNodes('run');
    const markdown = dataset.graph.find('markdown').node;
    expect(markdown.data.output).toEqual('sk-aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
  });
  it('Full pipeline run test', async () => {
    vi.spyOn(utils, 'readFileFromGCS').mockResolvedValue(weather);
    vi.spyOn(utils, 'uploadJSONToGCS').mockResolvedValue(
      `uploads/123/test/cluster_extraction.json`
    );
    const uploadJSONToGCSSpy = vi
      .spyOn(utils, 'uploadJSONToGCS')
      .mockResolvedValue(`uploads/123/test/cluster_extraction.json`);
    const dataset = getDataset();
    await dataset.processNodes('run');
    expect(dataset.graph.find('jq_v1').node.data.output[0].interview).toEqual('Alice');
    expect(dataset.graph.find('cluster_extraction').node.data.output).toEqual(
      mock_cluster_extraction_data
    );
    expect(uploadJSONToGCSSpy.mock.calls[0][0].data.output).toEqual(mock_cluster_extraction_data);
    expect(dataset.graph.find('argument_extraction').node.data.output).toEqual(
      mock_argument_extraction_data
    );
    expect(uploadJSONToGCSSpy.mock.calls[1][0].data.output).toEqual(mock_argument_extraction_data);
    expect(dataset.graph.find('merge').node.data.output).toEqual(mock_merge_data);
  });
});
