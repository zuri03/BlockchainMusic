import express from 'express'
import cors from 'cors';
import bodyParser from 'body-parser';
import userRouter from './routes/user-routes';
import { CustomErrorHandler } from './middleware/middleware-functions';

export default async function configureApp() : Promise<express.Application> {
    const app : express.Application = express();

    app.use(cors());

    //Simple and temporary request logger
    app.use((request, response, next) => {
        console.log(`INFO: ${request.method}: URL: ${request.url}`);
        next();
    });

    app.use(bodyParser.json());

    app.use('/api/User', userRouter);

    app.use(CustomErrorHandler);

    return app;
}
 