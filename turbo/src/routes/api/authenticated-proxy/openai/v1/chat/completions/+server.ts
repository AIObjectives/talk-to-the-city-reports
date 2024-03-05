import serviceAccount from '$lib/service-account-pk.json' assert { type: 'json' };
import { query, where, getDocs, addDoc, doc, setDoc } from 'firebase/firestore/lite';
import { keysCollection } from '$lib/firebase';
import admin from 'firebase-admin';
import { checkRateLimit } from '$lib/rateLimitter';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

let getKeys = async (uid) => {
  if (uid) {
    const q = query(keysCollection, where('uid', '==', uid));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data();
    }
  }
};

/**
 * @openapi
 * /api/authenticated-proxy/openai/v1/chat/completions:
 *   post:
 *     operationId: openAIAuthenticatedProxy
 *     summary: Enables users to make calls to OpenAI's API using server-side credentials.
 *     description: This endpoint acts as a proxy, forwarding all body and header data to OpenAI's API.
 *     parameters:
 *       - name: ownerUid
 *         in: query
 *         required: true
 *         description: UID of the dataset owner
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       '200':
 *         description: OpenAI response.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               additionalProperties: true
 *       '401':
 *         description: Unauthorized request.
 *       '404':
 *         description: User not found.
 *       '500':
 *         description: Internal server error.
 *     security:
 *       - BearerAuth: []
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
export async function POST(event) {
  const { url, request } = event;
  const ownerUid = new URL(request.url).searchParams.get('ownerUid');
  let ip_address = request.headers.get('x-forwarded-for') || event.getClientAddress();
  try {
    await checkRateLimit(ip_address);
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }, null, 2), {
      status: 429
    });
  }
  const body = await request.json();
  const keys = await getKeys(ownerUid);
  if (!keys) {
    return new Response(JSON.stringify({ error: 'User not found' }, null, 2), {
      status: 404
    });
  }
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${keys.openAIAPIKey}`
    }
  });
  const text = await response.text();
  return new Response(text, {
    status: response.status
  });
}
