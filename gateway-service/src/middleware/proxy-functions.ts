import { 
    NextFunction, 
    Request, 
    Response 
} from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import url from 'url';
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

//TODO: replace the values with environment variables for prod
const resourceToContainerNameMap: { [Resource: string]: string | undefined }  = {
    'User': 'user-container:8008',
    'Song': 'song-service:8080'
}

export const APIServicesProxyMiddleware = createProxyMiddleware({
    changeOrigin: true,
    router: (request): string => {

        //pull out the request resource for now it is either 'User' or 'Song'
        // ie /api/Song/Search/:searchTerm
        const requestedResource: string = request.path.split("/")[2];
        const hostAndPort: string | undefined = resourceToContainerNameMap[requestedResource];

        //if they request a resource that does not exist destroy the request
        if (!hostAndPort) {
            console.log('ROUTER DESTROYING REQUEST');
            //request.destroy();
            return request.url;
        }

        console.log('ROUTER RETURNED ' + `http://${hostAndPort!}${request.path}`);

        return `http://${hostAndPort!}${request.path}`;
    },
    onProxyReq: (proxyReq, request: Request, response: Response) => {
        //console.log('proxy request url ' + proxyReq.req.url)
        //if the request is destroyed then a they requested a resource that does not exist
        if (request.destroyed) {
            console.log('DESTROYED REQUEST RETURN NOT FOUND')
            proxyReq.destroy();
            response.status(400).json({ 'error': 'not found' });
            return;
        }
    },
    onProxyRes: (proxyRes, request: Request, response: Response) => {
        console.log('ON PROXY RES');

        let incomingMessageData = '';

        proxyRes.on('data', (chunk) => incomingMessageData += chunk);

        proxyRes.on('end', function () {
            console.log(incomingMessageData);

            try {
                const proxyResponseObj = JSON.parse(incomingMessageData);

                //every response from the APIs should have a statuscode if it does not assume an error occurred
                const responseStatusCode: number = proxyRes.statusCode ?? 500;

                let responseBody;
                if (responseStatusCode === 500) {
                    responseBody = { 'error': 'internal server error' }
                } else {
                    responseBody = proxyResponseObj;
                }

                response.status(responseStatusCode).json(responseBody);
            } catch (error) {
                response.status(500).json({ 'error': 'internal sever error' });
                return;
            }
        });

        proxyRes.on('error', (error) => {
            //log the error 
            console.log('proxyRes error occurred')
            console.log(error)
            response.status(500).json({ 'error': 'internal server error' })
        });
    },
    onError: (err, request, response, target) => {
        console.log(err);
        response.status(500).json({ 'error': 'internal server error' })
    }
});

export const LoginProxyMiddleware = createProxyMiddleware({
    target: 'http://user-container:8008/auth',
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
            console.log(incomingMessageData)
            const { data } = JSON.parse(incomingMessageData);
            res.locals.id = data;
        });
    },
    onError: (err, request, response, target) => {
        console.log(err);
        response.status(500).json({ 'error': 'internal server error' })
    }
});