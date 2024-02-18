import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';

export async function GET({ request }) {
  const requestUrl = new URL(request.url);
  const articleUrl = requestUrl.searchParams.get('url');
  if (articleUrl) {
    try {
      const response = await fetch(articleUrl);
      const html = await response.text();
      const dom = new JSDOM(html);
      const reader = new Readability(dom.window.document);
      const article = reader.parse();

      if (article) {
        const contentDOM = new JSDOM(article.content);
        const plainText = contentDOM.window.document.body.textContent;

        return new Response(plainText, {
          headers: { 'Content-Type': 'text/plain' },
          status: 200
        });
      } else {
        throw new Error('Article could not be parsed');
      }
    } catch (error) {
      if (error instanceof Error) {
        return new Response(JSON.stringify({ error: error.message }), {
          headers: { 'Content-Type': 'application/json' },
          status: 500
        });
      } else {
        return new Response(JSON.stringify({ error: 'An unknown error occurred' }), {
          headers: { 'Content-Type': 'application/json' },
          status: 500
        });
      }
    }
  } else {
    return new Response(JSON.stringify({ error: 'URL parameter is missing' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400
    });
  }
}
