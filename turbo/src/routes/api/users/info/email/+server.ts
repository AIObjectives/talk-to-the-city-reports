import serviceAccount from '$lib/service-account-pk.json' assert { type: 'json' };
import { authenticated } from '$lib/server_utils';

import admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const cache = {};

async function fetchEmailWithCaching(uid) {
  if (cache[uid]) {
    return cache[uid].data;
  }
  const userRecord = await admin.auth().getUser(uid);
  const emailData = { email: userRecord.email };
  cache[uid] = {
    data: emailData,
    timestamp: Date.now()
  };
  return emailData;
}

/**
 * @openapi
 * /api/users/info/email:
 *   get:
 *     operationId: userEmail
 *     summary: Gets the email for a user id
 *     description:
 *     parameters:
 *       - name: uid
 *         in: query
 *         required: true
 *         description: UID for the user
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Got email address
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *       401:
 *         description: Unauthorized request
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 *     security:
 *       - BearerAuth: []
 */
export const GET = authenticated(async ({ url, request, user }) => {
  const uid = new URL(request.url).searchParams.get('uid');
  if (!uid) {
    return new Response(JSON.stringify({ error: 'Missing uid' }, null, 2), { status: 400 });
  }
  const adminUID = import.meta.env.VITE_ADMIN;
  if (user !== adminUID) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }, null, 2), { status: 401 });
  }

  try {
    const emailData = await fetchEmailWithCaching(uid);
    return new Response(JSON.stringify(emailData, null, 2), { status: 200 });
  } catch (error) {
    console.error('Error fetching user data:', error);
    if (error.code === 'auth/user-not-found') {
      delete cache[uid];
      return new Response(JSON.stringify({ error: 'User not found' }, null, 2), {
        status: 404
      });
    }
    return new Response(JSON.stringify({ error: 'Error fetching user data' }, null, 2), {
      status: 500
    });
  }
});
