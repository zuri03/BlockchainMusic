import express, { Router, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import multer from 'multer';
import { customErrorHandler, validateAPIKey } from './middleware/middleware-functions';
import DataController from './controllers/data-controller';

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

    router.get('/:id', controller.getFile.bind(controller));
    router.post('/', controller.createFile.bind(controller));
    router.delete('/:id', controller.deleteFile.bind(controller));

    return router;
}

export default function configureApp(): express.Application {
    const app: express.Application = express();
    const upload = multer();
    //TEMP PATH
    const controller = new DataController('');
    const router = initRouter(controller);

    app.use(validateAPIKey);

    app.use('/api/SongFile', upload.single('song-file'), router);

    //Simple and temporary request logger
    app.use((request, response, next) => {
        console.log(`INFO: ${request.method}: URL: ${request.url}`);
        next();
    });

    app.use(bodyParser.json());

    app.use(customErrorHandler);

    return app;
}