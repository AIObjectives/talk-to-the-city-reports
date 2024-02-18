import { Dataset } from '$lib/dataset';
import { authenticated } from '$lib/server_utils';

/**
 * @openapi
 * /api/dataset/{dataset}:
 *   get:
 *     operationId: getDataset
 *     summary: Retrieves a dataset
 *     description: Loads and processes a dataset based on the provided slug.
 *     parameters:
 *       - name: dataset
 *         in: path
 *         required: true
 *         description: The slug of the dataset to load and process. e.g heal-michigan-9.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Returns the processed dataset.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       401:
 *         description: Unauthorized, token is missing or invalid.
 *       500:
 *         description: Internal server error.
 *     security:
 *       - BearerAuth: []
 */
/** @type {import('./$types').RequestHandler} */
export const GET = authenticated(async ({ url, request, user }) => {
  try {
    const urlParts = url.pathname.split('/');
    const slug = urlParts[urlParts.length - 1];
    const dataset = await Dataset.loadDataset(slug);
    await dataset?.processNodes('load');
    const doc = dataset?.datasetToDoc();
    return new Response(JSON.stringify(doc, null, 2), {});
  } catch (error) {
    return new Response(error.message || 'Internal server error', { status: 500 });
  }
});
