import type { Load } from '@sveltejs/kit';
import { Dataset } from '$lib/dataset';

export async function load(x): Promise<Load> {
	const slug = 'hm-test';
	const dataset = await Dataset.loadDataset(slug);
	await dataset?.processNodes('load');
	console.log(dataset);
	const doc = dataset?.datasetToDoc();
	console.log(doc);
	return { doc };
}
