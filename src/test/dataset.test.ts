// stock
import { describe, it, vi, beforeEach } from 'vitest';
import { expect } from 'vitest';
import deepCopy from 'deep-copy';

// data
import weather from '$lib/mock_data/csv/csv.csv?raw';
import cluster_prompt from '$lib/mock_data/cluster_extraction/prompt.txt?raw';
import cluster_system_prompt from '$lib/mock_data/cluster_extraction/system_prompt.txt?raw';
import arg_prompt from '$lib/mock_data/argument_extraction/prompt.txt?raw';
import arg_system_prompt from '$lib/mock_data/argument_extraction/system_prompt.txt?raw';
import mock_cluster_extraction_data from '$lib/mock_data/cluster_extraction/cluster_extraction.json';
import mock_argument_extraction_data from '$lib/mock_data/argument_extraction/argument_extraction.json';
import mock_merge_data from '$lib/mock_data/merge/merge.json';

// nodes
import CSVNode, { csv_node_data } from '$lib/compute/csv';
import JqNodeV1, { jq_node_data } from '$lib/compute/jq_v1';
import OpenAIKeyNode, { open_ai_key_node_data } from '$lib/compute/open_ai_key';
import ClusterExtractionNode, {
	cluster_extraction_node_data
} from '$lib/compute/cluster_extraction';
import ArgumentExtractionNode, {
	argument_extraction_node_data
} from '$lib/compute/argument_extraction';
import MergeNode, { merge_node_data } from '$lib/compute/merge';

// dataset
import { Dataset } from '$lib/dataset';

// utilities
import * as utils from '$lib/utils';
import Cookies from './test/mocks/js-cookie';

function get_open_ai_key() {
	const node = new OpenAIKeyNode(deepCopy(open_ai_key_node_data));
	node.data.text = 'sk-' + 'a'.repeat(48);
	Cookies.set('open_ai_key', node.data.text);
	return node;
}

function get_csv() {
	const csv_data = deepCopy(csv_node_data);
	const csv = new CSVNode(csv_data);
	csv.data.gcs_path = 'path/to/file.csv';
	return csv;
}

function get_jq() {
	const jq = new JqNodeV1(jq_node_data);
	jq.data.text = '.';
	return jq;
}

function get_cluster_extraction() {
	const node = new ClusterExtractionNode(deepCopy(cluster_extraction_node_data));
	node.data.prompt = cluster_prompt;
	node.data.system_prompt = cluster_system_prompt;
	node.data.input_ids.csv = 'jq_v1';
	node.data.input_ids.open_ai_key = 'open_ai_key';
	return node;
}

function get_argument_extraction() {
	const node = new ArgumentExtractionNode(deepCopy(argument_extraction_node_data));
	node.data.prompt = arg_prompt;
	node.data.system_prompt = arg_system_prompt;
	node.data.input_ids.csv = 'jq_v1';
	node.data.input_ids.open_ai_key = 'open_ai_key';
	node.data.input_ids.cluster_extraction = 'cluster_extraction';
	return node;
}

function get_merge() {
	const node = new MergeNode(deepCopy(merge_node_data));
	node.data.input_ids.argument_extraction = 'argument_extraction';
	node.data.input_ids.cluster_extraction = 'cluster_extraction';
	return node;
}

function get_graph() {
	const csv = get_csv();
	const jq = get_jq();
	const key = get_open_ai_key();
	const cs = get_cluster_extraction();
	const as = get_argument_extraction();
	const merge = get_merge();
	const nodes = [csv, jq, key, cs, as, merge];
	const edges = [
		{
			source: csv_node_data.id,
			target: jq_node_data.id
		},
		{
			source: jq_node_data.id,
			target: cluster_extraction_node_data.id
		},
		{
			source: open_ai_key_node_data.id,
			target: cluster_extraction_node_data.id
		},
		{
			source: jq_node_data.id,
			target: argument_extraction_node_data.id
		},
		{
			source: cluster_extraction_node_data.id,
			target: argument_extraction_node_data.id
		},
		{
			source: open_ai_key_node_data.id,
			target: argument_extraction_node_data.id
		},
		{
			source: argument_extraction_node_data.id,
			target: merge_node_data.id
		},
		{
			source: cluster_extraction_node_data.id,
			target: merge_node_data.id
		}
	];
	return { nodes: nodes, edges: edges };
}

describe('Full pipeline run test', () => {
	beforeEach(() => {
		vi.restoreAllMocks();
	});
	it('CSV JQ test', async () => {
		vi.spyOn(utils, 'readFileFromGCS').mockResolvedValue(weather);
		vi.spyOn(utils, 'uploadDataToGCS').mockResolvedValue(
			`uploads/123/test/cluster_extraction.json`
		);
		const uploadDataToGCSSpy = vi
			.spyOn(utils, 'uploadDataToGCS')
			.mockResolvedValue(`uploads/123/test/cluster_extraction.json`);
		const dataset = new Dataset(
			'title',
			'/test',
			'owner',
			'template',
			'description',
			get_graph(),
			'id'
		);
		await dataset.processNodes('run');
		expect(dataset.graph.find('jq_v1').node.data.output[0].interview).toEqual('Alice');
		expect(dataset.graph.find('cluster_extraction').node.data.output).toEqual(
			mock_cluster_extraction_data
		);
		expect(uploadDataToGCSSpy.mock.calls[0][0].data.output).toEqual(mock_cluster_extraction_data);
		expect(dataset.graph.find('argument_extraction').node.data.output).toEqual(
			mock_argument_extraction_data
		);
		expect(uploadDataToGCSSpy.mock.calls[1][0].data.output).toEqual(mock_argument_extraction_data);
		expect(dataset.graph.find('merge').node.data.output).toEqual(mock_merge_data);
	});
});
