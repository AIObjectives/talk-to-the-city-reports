import { tick } from 'svelte';
import { Dataset } from '$lib/dataset';
import nodes from '$lib/node_register';
import { get } from 'svelte/store';
import serviceAccount from '$lib/service-account-pk.json' assert { type: 'json' };
import _ from 'lodash';
import admin from 'firebase-admin';

if (!admin.apps.length) {
	admin.initializeApp({
		credential: admin.credential.cert(serviceAccount)
	});
}

/**
 * @openapi
 * /api/dataset/{dataset}/chat/completions:
 *   post:
 *     operationId: chat
 *     summary: Lets the user chat with the dataset
 *     description: This endpoint lets the user chat with the dataset.
 *     parameters:
 *       - name: dataset
 *         in: path
 *         required: true
 *         description: The slug of the dataset e.g., heal-michigan-9
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               messages:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     role:
 *                       type: string
 *                       enum: [user, assistant, system]
 *                     content:
 *                       type: string
 *                       example: "Summarize your opinions in 50 words."
 *               OPENAI_KEY:
 *                 type: string
 *                 description: OpenAI API key for authentication
 *     responses:
 *       200:
 *         description: Successfully generated the chat
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
export const POST = async function ({ url, request }) {
	const body = await request.json();
	const messages = body.messages || [];
	const openAIKey = body.OPENAI_KEY;
	try {
		const urlParts = url.pathname.split('/');
		const slug = urlParts[urlParts.length - 3];
		const dataset = await Dataset.loadDataset(slug);
		await dataset?.processNodes('load');
		await tick();
		const node = get(dataset.graph.nodes).find((x) => x.data.compute_type === 'chat_v0');
		const node_impl = nodes.init(node.data.compute_type, node);
		const result = await node_impl.chat(messages, dataset, openAIKey);
		const response = JSON.stringify({
			choices: [{ message: { content: _.last(result)?.content } }]
		});
		return new Response(response, {
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (error) {
		return new Response(JSON.stringify({ error: error.message || 'Internal server error' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};
