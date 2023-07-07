import { 
    NextFunction, 
    Request, 
    Response 
} from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

export const ServicesProxyMiddleware = createProxyMiddleware({
    target: 'http://user-container:8008/auth',
    changeOrigin: true,
    
    pathRewrite: function (path, req) {
        if (req.path != "/login") {
            console.log('path rewrite is ' + req.path)
            return req.path;
        }
        console.log('pathrewrite to /auth')
        return '';
    },
    onProxyReq: (proxyRes, req, res) => {
        console.log('going to http://user-container:8008/auth')
        console.log('onProxyReq');
        console.log('onReq body');
        console.log(req.body);
    },
    onProxyRes: (proxyRes, req, res) => {
        console.log('ON PROXY RES');

        console.log('request body' + req.body);

        let incomingMessageData = '';

        proxyRes.on('data', function (chunk) {
            incomingMessageData += chunk
        });

        proxyRes.on('end', function () {
            console.log('END HAS BEEN RECEIVED');
            console.log(incomingMessageData)
            let obj = JSON.parse(incomingMessageData);
            console.log(obj);
            res.status(200).json(obj);
        });
    },
    onError: (err, request, response, target) => {
        console.log('ERROR HAS OCCURED ON ERROR EXECUTING');
        console.log(err);
        response.status(500).json({ 'error': 'internal server error' })
    }
});