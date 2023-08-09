import express, { Router, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import multer from 'multer';
import { customErrorHandler, validateAPIKey } from './middleware/middleware-functions';
import DataController from './controllers/data-controller';
import path from 'path';
import NodeCache from 'node-cache';

const initRouter = function (controller: DataController): Router {
    const router = Router();

    router.use((request: Request, response: Response, next: NextFunction) => {
        const method: string = request.method;
    
        if (![ 'GET', 'POST', 'DELETE' ].includes(method)) {
            response.status(405).json({ 'error': 'method not supported' });
            return;
        }
    
        next();
    });

    router.get('/:authorid/:songid', controller.getFile.bind(controller));
    router.post('/:authorid/:songid', controller.createFile.bind(controller));
    router.delete('/:authorid/:songid', controller.deleteFile.bind(controller));

    return router;
}

export default function configureApp(): express.Application {
    const app: express.Application = express();
    const upload = multer();
    const controller = new DataController(
        path.join(process.cwd(), 'songs'), new NodeCache({ stdTTL: 120 }));
    const router = initRouter(controller);
    
    //Simple and temporary request logger
    app.use((request, response, next) => {
        console.log(`INFO: ${request.method}: URL: ${request.url}`);
        next();
    });

    //app.use(validateAPIKey);

    app.use('/api/File', upload.single('song-file'), router);

    app.use((request, response, next) => {
        response.status(404).json({ 'error': 'unsupported route'});
        return;
    });

    app.use(bodyParser.json());

    app.use(customErrorHandler);

    return app;
}