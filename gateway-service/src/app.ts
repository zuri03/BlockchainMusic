import express from 'express';
import cors from 'cors';
import session from 'express-session';
import crypto from 'crypto';
import { CustomErrorHandler, checkForUserid } from './middleware/middleware-functions';
import { APIServicesProxyMiddleware } from './middleware/proxy-functions';
import loginRouter from './routes/login-routes';

export default async function configureApp() : Promise<express.Application> {

    const app : express.Application = express();

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

    app.use(loginRouter);

    //body parser breaks the proxy
    //app.use(bodyParser.json());

    //move checking userid logic to the individual services
    //app.use(checkForUserid)

    //Simple and temporary request logger
    app.use((request, response, next) => {
        //console.log(`INFO: ${request.method}: URL: ${request.url}, SessionId: ${request.sessionID}, userid: ${request.session.userid}`);
        console.log(`INFO: ${request.method}: URL: ${request.url}, SessionId: ${request.sessionID}, userid: exampleUserId`);

        //all non GET request require authentication
        if (request.method !== 'GET' || request.path.includes('User')) {
            //request.headers.authorization = `Basic ${request.session.userid}`;
            request.headers.authorization = `Basic exampleUserId`;
        } 

        next();
    }, APIServicesProxyMiddleware);

    //Error handler middleware function
    app.use(CustomErrorHandler);

    return app;
}

 