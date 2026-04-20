import server from '../dist/server/server.js';

export default async (req, res) => {
  try {
    // Build the full URL
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const host = req.headers['x-forwarded-host'] || req.headers.host || 'localhost';
    const url = `${protocol}://${host}${req.url}`;

    // Create a Web API Request
    const webRequest = new Request(url, {
      method: req.method,
      headers: req.headers,
      body: ['GET', 'HEAD'].includes(req.method) ? null : req,
    });

    // Call the server's fetch handler
    const webResponse = await server.fetch(webRequest);

    // Set status code
    res.status(webResponse.status);

    // Copy headers
    for (const [key, value] of webResponse.headers.entries()) {
      res.setHeader(key, value);
    }

    // Stream the response body
    if (webResponse.body) {
      const reader = webResponse.body.getReader();
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          res.write(Buffer.from(value));
        }
      } finally {
        reader.releaseLock();
      }
    }
    
    res.end();
  } catch (error) {
    console.error('Error in SSR:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
