import serviceAccount from '$lib/service-account-pk.json' assert { type: 'json' };

export async function GET({ url, request }) {
	return new Response(JSON.stringify({ type: serviceAccount.type }, null, 2), { status: 200 });
}
