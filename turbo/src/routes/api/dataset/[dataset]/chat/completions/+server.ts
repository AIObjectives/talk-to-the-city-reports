import { tick } from 'svelte';
import { Dataset } from '$lib/dataset';
import nodes from '$lib/node_register';
import { get } from 'svelte/store';
import serviceAccount from '$lib/service-account-pk.json' assert { type: 'json' };
import _ from 'lodash';
import admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as any)
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
  if (!openAIKey) {
    return new Response(JSON.stringify({ error: 'OpenAI key is missing' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  try {
    const urlParts = url.pathname.split('/');
    const slug = urlParts[urlParts.length - 3];
    const dataset = await Dataset.loadDataset(slug);
    if (!dataset) {
      throw new Error('Dataset not found');
    }
    await dataset.processNodes('load', null);
    await tick();
    const node = get(dataset.graph.nodes).find((x) => x.data.compute_type === 'chat_v0');
    if (!node) {
      throw new Error('Chat node not found');
    }
    const node_impl = nodes.init(node.data.compute_type, node);
    const result = await node_impl.chat(messages, dataset, openAIKey);
    const lastMessage = _.last(result) as any;
    console.log('lastMessage', lastMessage);
    if (!lastMessage || typeof lastMessage.content !== 'string') {
      throw new Error('Invalid response from chat node');
    }
    const response = JSON.stringify({
      choices: [{ message: { content: lastMessage.content } }]
    });
    return new Response(response, {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
