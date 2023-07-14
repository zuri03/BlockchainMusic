import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

export default function configureApp(): express.Application {

    const app: express.Application = express();

    app.use(cors());

    //Simple and temporary request logger
    app.use((request, response, next) => {
        console.log(`INFO: ${request.method}: URL: ${request.url}`);
        next();
    });

    app.use(bodyParser.json());

    return app;
}