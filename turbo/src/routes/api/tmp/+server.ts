import serviceAccount from '$lib/tttc-turbo-firebase-adminsdk-dcrfe-45c85403c1.json' assert { type: 'json' };

export async function GET({ url, request }) {
	return new Response(JSON.stringify({ type: serviceAccount.type }, null, 2), { status: 200 });
}
