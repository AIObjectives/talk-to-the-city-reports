import ArgumentExtractionNode, {
	argument_extraction_node_data
} from '$lib/compute/argument_extraction';
import deepCopy from 'deep-copy';
import { describe, it, vi, beforeEach } from 'vitest';
import { expect } from 'vitest';
import mock_argument_extraction_data from '$lib/mock_data/argument_extraction/argument_extraction.json';
import mock_cluster_extraction_data from '$lib/mock_data/cluster_extraction/cluster_extraction.json';
import csv_data from '$lib/mock_data/csv/csv.json';
import prompt from '$lib/mock_data/argument_extraction/prompt.txt?raw';
import system_prompt from '$lib/mock_data/argument_extraction/system_prompt.txt?raw';

vi.mock('$lib/utils', () => ({
	readFileFromGCS: vi.fn(() => Promise.resolve(JSON.stringify(mock_argument_extraction_data))),
	uploadDataToGCS: vi.fn(() => Promise.resolve())
}));

describe('ArgumentExtractionNode class', () => {
	let node;
	let inputData;

	beforeEach(() => {
		node = new ArgumentExtractionNode(deepCopy(argument_extraction_node_data));
		inputData = {
			open_ai_key: 'sk-aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
			csv: csv_data,
			cluster_extraction: mock_cluster_extraction_data
		};
		node.data.prompt = prompt;
		node.data.system_prompt = system_prompt;
	});

	it('extract the given arguments', async () => {
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

	it('should not extract the arguments if no csv', async () => {
		delete inputData.csv;
		const output = await node.compute(
			inputData,
			'run',
			console.log,
			console.error,
			console.log,
			'test_slug'
		);
		expect(output).toEqual(undefined);
	});

	it('should not extract the arguments if no open_ai_key and no GCS', async () => {
		delete inputData.open_ai_key;
		const output = await node.compute(
			inputData,
			'run',
			console.log,
			console.error,
			console.log,
			'test_slug'
		);
		expect(output).toEqual(undefined);
	});

	it('should extract the arguments if no open_ai_key and GCS', async () => {
		delete inputData.open_ai_key;
		node.data.gcs_path = 'gs://test_bucket/test_path';
		node.data.csv_length = csv_data.length;
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

	it('should not extract the arguments if no prompt and no system prompt', async () => {
		node.data.system_prompt = undefined;
		node.data.prompt = undefined;
		const output = await node.compute(
			inputData,
			'run',
			console.log,
			console.error,
			console.log,
			'test_slug'
		);
		expect(output).toEqual(undefined);
	});

	it('test GCS caching', async () => {
		node.data.gcs_path = 'gs://test_bucket/test_path';
		node.data.dirty = false;
		node.data.csv_length = csv_data.length;
		const output = await node.compute(
			inputData,
			'run',
			(x) => {
				console.log(x);
				expect(x == 'Calling OpenAI').toEqual(false);
			},
			console.error,
			console.log,
			'test_slug'
		);
		expect(output).toEqual(mock_argument_extraction_data);
	});
});
