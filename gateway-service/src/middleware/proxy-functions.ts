import { createProxyMiddleware } from 'http-proxy-middleware';

/*
UNAUTHENTICATED API SERVICES: Services that can be used without login
    GET: /api/Song
    GET: /api/Song/Search/:searchTerm
    GET: /api/Song/:id

AUTHENTICATED API SERVICES: reqiures userid in the request
    DELETE: /api/Song/:id
    PUT: /api/Song/:id
    POST: /api/Song
    GET: /api/User/:id
    POST: /api/User
*/

export const APIServicesProxyMiddleware = createProxyMiddleware({
    changeOrigin: true,
    router: {
        '/api/Song': 'http://song-container:8888',   
        '/api/Cover': 'http://song-container:8888',   
        '/api/User': 'http://user-container:8008',  
        '/api/Address': 'http://blockchain-container:9999'  
    },
    onProxyReq: (proxyReq, request, response) => proxyReq.setHeader("API-Key", process.env.API_KEY!),
    onError: (err, request, response, target) => {
        console.log(err);
        response.status(500).json({ 'error': 'internal server error' })
    }
});