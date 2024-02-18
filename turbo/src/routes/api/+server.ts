/** @type {import('./$types').RequestHandler} */
export async function GET({ url, request }) {
  return new Response('', {
    status: 302,
    headers: {
      Location: '/api.html'
    }
  });
}
