import server from '../../dist/server/server.js';

export default async (event, context) => {
  try {
    const url = new URL(event.rawUrl);
    const webRequest = new Request(url, {
      method: event.httpMethod,
      headers: event.headers,
      body: ['GET', 'HEAD'].includes(event.httpMethod) ? null : event.body,
    });

    const webResponse = await server.fetch(webRequest);
    const body = await webResponse.text();

    return {
      statusCode: webResponse.status,
      headers: Object.fromEntries(webResponse.headers),
      body,
    };
  } catch (error) {
    console.error('SSR Error:', error);
    return {
      statusCode: 500,
      body: 'Internal Server Error',
    };
  }
};
