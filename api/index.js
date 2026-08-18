export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const url = new URL(req.url);
  const target = url.searchParams.get('url') || req.headers.get('x-target-url');
  
  if (!target) {
    return new Response('Proxy is running.', { status: 200 });
  }

  try {
    return await fetch(target, {
      method: req.method,
      headers: req.headers,
      body: req.body,
    });
  } catch (err) {
    return new Response(err.message, { status: 500 });
  }
}
