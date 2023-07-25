import express from 'express';
import bodyParser from 'body-parser';
import addressRouter from './routes/address-routes';
import { customErrorHandler, validateAPIKey } from './middleware/middleware-functions';

export default function configureApp(): express.Application {

    const app: express.Application = express();

    app.use(validateAPIKey);

    //Simple and temporary request logger
    app.use((request, response, next) => {
        console.log(`INFO: ${request.method}: URL: ${request.url}`);
        next();
    });

    app.use(bodyParser.json());

    app.use('/api/Address', addressRouter)

    app.use(customErrorHandler);

    return app;
}