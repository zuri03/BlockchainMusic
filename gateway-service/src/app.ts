import express from 'express';
import cors from 'cors';
import session from 'express-session';
import crypto from 'crypto';
import { CustomErrorHandler, checkForUserid } from './middleware/middleware-functions';

export default async function configureApp() : Promise<express.Application> {

    const app : express.Application = express();

    app.use(cors());

    app.use(session({
        genid: (req) => crypto.randomUUID(),
        //resave may change in the future depending on session store
        resave: false,
        secret: process.env.SESSION_SECRET!,
        cookie: { sameSite: 'lax', secure: true },
        saveUninitialized: false,
        unset: 'destroy'
    }));
    
    app.use(checkForUserid);

    //Simple and temporary request logger
    app.use((request, response, next) => {
        console.log(`INFO: ${request.method}: URL: ${request.url}`);
        next();
    });

    //Error handler middleware function
    app.use(CustomErrorHandler);

    return app;
}

 