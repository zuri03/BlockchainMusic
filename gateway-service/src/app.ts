import express from 'express';
import cors from 'cors';
import session from 'express-session';
import crypto from 'crypto';
import { CustomErrorHandler, checkForUserid } from './middleware/middleware-functions';
import loginRouter from './routes/login-routes';

export default async function configureApp() : Promise<express.Application> {

    const app : express.Application = express();

    app.use(cors());
    
    app.use(session({
        genid: (req) => crypto.randomUUID(),
        //resave may change in the future depending on session store
        resave: true,
        secret: 'secrete', //process.env.SESSION_SECRET!,
        //Set secure: true when changing to HTTPS
        cookie: { sameSite: 'lax', secure: false },
        saveUninitialized: true,
        unset: 'destroy'
    }));
    
    //app.use(checkForUserid);

    //Simple and temporary request logger
    app.use((request, response, next) => {
        console.log(request.sessionID)
        console.log(`INFO: ${request.method}: URL: ${request.url}`);
        next();
    });

    app.use(loginRouter);

    //Error handler middleware function
    app.use(CustomErrorHandler);

    return app;
}

 