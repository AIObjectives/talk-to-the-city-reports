import type { Load } from '@sveltejs/kit';
import { Dataset } from '$lib/dataset';

export async function load(x): Promise<Load> {
  const slug = 'heal-michigan-9';
  console.log('loading');
  const dataset = await Dataset.loadDataset(slug);
  await dataset?.processNodes('load');
  console.log(dataset);
  dataset.clearLogs();
  const doc = dataset?.datasetToDoc();
  console.log(doc);
  return { doc };
}
