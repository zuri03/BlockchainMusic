import express from 'express'
import cors from 'cors';
import bodyParser from 'body-parser';
import userRouter from './routes/user-routes';
import authenticationRouter from './routes/authenticate-routes';
import { CustomErrorHandler } from './middleware/middleware-functions';
import { connectToDatabase } from './db/database';

export default async function configureApp() : Promise<express.Application> {

    await connectToDatabase();

    const app : express.Application = express();

    app.use(cors());

    //Simple and temporary request logger
    app.use((request, response, next) => {
        console.log(`INFO: ${request.method}: URL: ${request.url}`);
        next();
    });

    app.use(bodyParser.json());

    app.use('/auth', authenticationRouter);

    app.use('/api/User', userRouter);

    app.use((request, response, next) => {
        response.status(404).json({ 'error': 'unsupported route'});
        return;
    });

    app.use(CustomErrorHandler);

    return app;
}
 