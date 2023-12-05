import { Dataset } from '$lib/dataset';
import admin from 'firebase-admin';
import serviceAccount from '$lib/tttc-turbo-firebase-adminsdk-dcrfe-45c85403c1.json' assert { type: 'json' };

if (!admin.apps.length) {
	admin.initializeApp({
		credential: admin.credential.cert(serviceAccount)
	});
}

// TODO: not sure where best to place this
const checkFirebaseToken = async (token) => {
	try {
		const decodedToken = await admin.auth().verifyIdToken(token);
		return decodedToken;
	} catch (error) {
		console.log(error);
		return null;
	}
};

/** @type {import('./$types').RequestHandler} */
export async function GET({ url, request }) {
	try {
		const slug = url.searchParams.get('slug');
		const token = request.headers.get('Authorization')?.split('Bearer ')[1];
		if (!token) {
			return new Response('Unauthorized', { status: 401 });
		}
		const user = await checkFirebaseToken(token);
		if (!user) {
			return new Response('Unauthorized', { status: 401 });
		}
		const dataset = await Dataset.loadDataset(slug);
		await dataset?.processNodes('load');
		const doc = dataset?.datasetToDoc();
		return new Response(JSON.stringify(doc, null, 2), {});
	} catch (error) {
		return new Response(error.message || 'Internal server error', { status: 500 });
	}
}
