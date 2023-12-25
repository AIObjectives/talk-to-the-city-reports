import type { Load } from '@sveltejs/kit';
import { Dataset } from '$lib/dataset';

export async function load(x): Promise<Load> {
	const slug = 'heal-michigan-9';
	const dataset = await Dataset.loadDataset(slug);
	await dataset?.processNodes('load');
	console.log(dataset);
	const doc = dataset?.datasetToDoc();
	console.log(doc);
	return { doc };
}
