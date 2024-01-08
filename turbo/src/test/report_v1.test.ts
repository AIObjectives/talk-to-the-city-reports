import { describe, it, expect, vi } from 'vitest';
import ReportNode, { report_node_data } from '$lib/compute/report_v1';
import deepCopy from 'deep-copy';
import merge from '$lib/mock_data/merge/merge.json';
import csv from '$lib/mock_data/csv/csv.json';

describe('ReportNode class', () => {
	let node;

	it('should set the output of the node to the input data', async () => {
		node = new ReportNode(deepCopy(report_node_data));
		node.data.input_ids.merge = 'merge';
		node.data.input_ids.csv = 'csv';
		const result = await node.compute(
			{ merge: merge, csv: csv },
			'run',
			vi.fn(),
			vi.fn(),
			vi.fn(),
			'test_slug',
			vi.fn()
		);
		expect(result.merge).toEqual(merge);
		expect(result.csv).toEqual(csv);
	});
});
