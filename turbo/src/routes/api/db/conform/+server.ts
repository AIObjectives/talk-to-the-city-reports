import _ from 'lodash';
import { query, getDocs, orderBy } from 'firebase/firestore/lite';
import type { QueryConstraint } from 'firebase/firestore';
import { datasetCollection } from '$lib/firebase';

import { authenticated } from '$lib/server_utils';

import { Dataset } from '$lib/dataset';

/**
 * @openapi
 * /api/db/conform:
 *   get:
 *     operationId: Conform
 *     summary: admin endpoint conform dataset data to their latest schema
 *     description: since node schemas can be modified, this endpoint will conform all datasets to their latest schema
 *     parameters:
 *       - in: query
 *         name: dryRun
 *         required: false
 *         description: Executes conforming in dry run mode without committing changes. Defaults to true.
 *         schema:
 *           type: boolean
 *           default: true
 *     responses:
 *       200:
 *         description: Successfully conformed datasets
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       401:
 *         description: Unauthorized request
 *       500:
 *         description: Internal server error
 *     security:
 *       - BearerAuth: []
 */
/** @type {import('./$types').RequestHandler} */
export const GET = authenticated(async ({ url, request }) => {
  // This endpoint enables admins to conform all datasets,
  // however bear in mind that datasets auto-conform on load.
  // keeping this endpoint for now, but it's not really needed.
  const requestUrl = new URL(request.url);
  const dryRun = requestUrl.searchParams.get('dryRun') == 'true';
  const filter: QueryConstraint[] = [];
  filter.push(orderBy('timestamp', 'desc'));
  const q = query(datasetCollection, ...filter);
  const querySnapshot = await getDocs(q);
  let log = '';
  log += 'Dry run: ' + dryRun + '\n';
  const datasets = querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return new Dataset(
      data.title,
      data.slug,
      data.owner,
      data.template,
      data.description,
      data.graph,
      doc.id
    );
  });
  _.forEach(datasets, async (dataset, i) => {
    if (dataset.owner != import.meta.env.VITE_ADMIN) {
      return;
    }
    log += '-------------------------------------------\n';
    log += `Owner: ${dataset.owner} - Dataset: ${i} ${dataset.slug}\n`;
    log += dataset.graph.conform(dryRun, dryRun);
    log += 'Laying out the graph';
  });
  return new Response(log);
});
