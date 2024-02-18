import { Dataset } from '$lib/dataset';
import { authenticated } from '$lib/server_utils';
/**
 * @openapi
 * /api/dataset/{dataset}/node/{node}:
 *   get:
 *     operationId: getNode
 *     summary: Retrieves a specific node from a dataset
 *     description: This endpoint retrieves a node from a dataset using the provided dataset and node as path parameters. The dataset is used to load the dataset and the node is used to retrieve the specific node.
 *     parameters:
 *       - name: dataset
 *         in: path
 *         required: true
 *         description: The slug of the dataset to retrieve the node from e.g heal-michigan-9
 *         schema:
 *           type: string
 *       - name: node
 *         in: path
 *         required: true
 *         description: The id of the node to retrieve from the dataset e.g cluster_extraction_1
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved the node
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
  try {
    const urlParts = url.pathname.split('/');
    const slug = urlParts[urlParts.length - 3];
    const id = urlParts[urlParts.length - 1];
    console.log(slug, id);
    const dataset = await Dataset.loadDataset(slug);
    await dataset?.processNodes('load');
    const doc = dataset?.getNodeById(id);
    return new Response(JSON.stringify(doc, null, 2), {});
  } catch (error) {
    return new Response(error.message || 'Internal server error', { status: 500 });
  }
});
