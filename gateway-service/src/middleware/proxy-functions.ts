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
        '/api/Song'                      : 'http://song-container:8888',   // path only
        '/api/User'                      : 'http://user-contianer:8008'   // path only
    },
    onProxyReq: (proxyReq, request, response) => proxyReq.setHeader("API-Key", process.env.API_KEY!),
    onError: (err, request, response, target) => {
        console.log(err);
        response.status(500).json({ 'error': 'internal server error' })
    }
});

export const AuthenticationProxyMiddleware = createProxyMiddleware({
    target: 'http://user-container:8008/auth',//'http://localhost:8008/auth',//
    changeOrigin: true,
    //remove the path entirely, since the request is going to /auth and the request is to /auth the resulting 
    //proxy request will be to /auth/auth
    pathRewrite: (path, req) => '',
    onProxyRes: (proxyRes, req, res) => {
        console.log('ON PROXY RES');
        let incomingMessageData = '';

        proxyRes.on('data', function (chunk) {
            incomingMessageData += chunk
        });

        proxyRes.on('end', function () {
            console.log('onProxyres end')
            console.log(incomingMessageData);
            console.log(proxyRes.statusCode)
            if (proxyRes.statusCode !== 200) {
                const { error } = JSON.parse(incomingMessageData);
                res.locals.err = error
                res.locals.status = proxyRes.statusCode;
                return;
            }

            console.log(JSON.parse(incomingMessageData));
            const { data } = JSON.parse(incomingMessageData);
            res.locals.id = data;
        });
    },
    onError: (err, request, response, target) => {
        console.log('proxy OnError')
        console.log(err);
        response.status(500).json({ 'error': 'internal server error' })
    }
});
