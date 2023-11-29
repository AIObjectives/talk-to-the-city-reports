import { edit_csv, edit_csv_node } from '$lib/compute/edit_csv';
import deepCopy from 'deep-copy';
import { describe, it } from 'vitest';
import { expect } from 'vitest';

describe('edit_csv', () => {
	it('generates new columns', async () => {
		const node = deepCopy(edit_csv_node);
		node.data.generate = { newColumn: 'newValue' };
		const inputData = { csv: [{ column1: 'value1' }] };
		const output = await edit_csv(node, inputData, null);
		expect(output).toEqual([{ column1: 'value1', newColumn: 'newValue' }]);
	});

	it('deletes columns', async () => {
		const node = deepCopy(edit_csv_node);
		node.data.delete = ['column1'];
		const inputData = { csv: [{ column1: 'value1', column2: 'value2' }] };
		const output = await edit_csv(node, inputData, null);
		expect(output).toEqual([{ column2: 'value2' }]);
	});

	it('renames columns', async () => {
		const node = deepCopy(edit_csv_node);
		node.data.rename = { column1: 'newColumn1' };
		const inputData = { csv: [{ column1: 'value1', column2: 'value2' }] };
		const output = await edit_csv(node, inputData, null);
		expect(output).toEqual([{ newColumn1: 'value1', column2: 'value2' }]);
	});

	it('returns undefined if input is undefined', async () => {
		const node = deepCopy(edit_csv_node);
		const inputData = { csv: undefined };
		const output = await edit_csv(node, inputData, null);
		expect(output).toBeUndefined();
	});
	it('handles multiple operations', async () => {
		const node = deepCopy(edit_csv_node);
		node.data.generate = { newColumn: 'newValue' };
		node.data.delete = ['column1'];
		node.data.rename = { column2: 'newColumn2' };
		const inputData = { csv: [{ column1: 'value1', column2: 'value2' }] };
		const output = await edit_csv(node, inputData, null);
		expect(output).toEqual([{ newColumn: 'newValue', newColumn2: 'value2' }]);
	});

	it('does not modify input if no operations are specified', async () => {
		const node = deepCopy(edit_csv_node);
		const inputData = { csv: [{ column1: 'value1', column2: 'value2' }] };
		const output = await edit_csv(node, inputData, null);
		expect(output).toEqual(inputData.csv);
	});

	it('does not crash if input is empty', async () => {
		const node = deepCopy(edit_csv_node);
		const inputData = { csv: [] };
		const output = await edit_csv(node, inputData, null);
		expect(output).toEqual([]);
	});
});
