// import serviceAccount from '$lib/service-account-pk.json' assert { type: 'json' };
// import { authenticated } from '$lib/server_utils';

// import admin from 'firebase-admin';

// if (!admin.apps.length) {
// 	admin.initializeApp({
// 		credential: admin.credential.cert(serviceAccount)
// 	});
// }

// /**
//  * @openapi
//  * /api/tmp:
//  *   get:
//  *     operationId: userEmail
//  *     summary: Gets the email for a user id
//  *     description:
//  *     parameters:
//  *       - name: uid
//  *         in: query
//  *         required: true
//  *         description: UID for the user
//  *         schema:
//  *           type: string
//  *     responses:
//  *       200:
//  *         description: Got email address
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 email:
//  *                   type: string
//  *       401:
//  *         description: Unauthorized request
//  *       404:
//  *         description: User not found
//  *       500:
//  *         description: Internal server error
//  *     security:
//  *       - BearerAuth: []
//  */
// export const GET = authenticated(async ({ url, request }) => {
// 	const uid = new URL(request.url).searchParams.get('uid');

// 	try {
// 		const userRecord = await admin.auth().getUser(uid);
// 		return new Response(JSON.stringify({ email: userRecord.email }, null, 2), { status: 200 });
// 	} catch (error) {
// 		console.error('Error fetching user data:', error);
// 		if (error.code === 'auth/user-not-found') {
// 			return new Response(JSON.stringify({ error: 'User not found' }, null, 2), {
// 				status: 404
// 			});
// 		}
// 		return new Response(JSON.stringify({ error: 'Error fetching user data' }, null, 2), {
// 			status: 500
// 		});
// 	}
// });
