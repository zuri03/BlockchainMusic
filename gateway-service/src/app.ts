import express, { Router, Request, Response, NextFunction, Application } from 'express';
import cors from 'cors';
import session from 'express-session';
import crypto from 'crypto';
import { CustomErrorHandler } from './middleware/middleware-functions';
import { APIServicesProxyMiddleware } from './middleware/proxy-functions';
import LoginController from './controllers/login-controller';

const initRouter = function (controller: LoginController): Router {
    const router = Router();

    router.use((request: Request, response: Response, next: NextFunction) => {
        const method: string = request.method;
        
        if (method !== 'POST') {
            response.status(405).json({ 'error': 'method not supported' });
            return;
        }
        
        next();
    });

    router.post('/', controller.login.bind(controller));
    return router;
}

export default async function configureApp(controller: LoginController) : Promise<Application> {

    const app : Application = express();
    const router = initRouter(controller);

    app.use(cors({
        origin: 'http://localhost:3000',
        methods: [ 'GET', 'PUT', 'POST', 'DELETE', 'OPTIONS', 'PATCH' ],
        credentials: true
    }));
    
    app.use(session({
        genid: (req) => crypto.randomUUID(),
        //resave may change in the future depending on session store
        resave: true,
        secret: process.env.SESSION_SECRET!,
        //Set secure: true when changing to HTTPS
        cookie: { sameSite: 'lax', secure: false },
        saveUninitialized: true,
        unset: 'destroy'
    }));

    app.use((request, response, next) => {
        console.log(request.headers)
        console.log(`INFO: ${request.method}: URL: ${request.url}, SessionId: ${request.sessionID}, userid: ${request.session.userid}, auth: ${request.get('authorization')}`);
        next();
    });

    app.use('/login', router);

    //Simple and temporary request logger
    
    app.use((request, response, next) => {

        //all non GET request require authentication
        if (request.method !== 'GET' || request.path.includes('User')) {
            request.headers.authorization = `Basic ${request.session.userid}`;
        } 

        next();
    }, APIServicesProxyMiddleware);

    //Error handler middleware function
    app.use(CustomErrorHandler);

    return app;
}

 