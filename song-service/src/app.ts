import bodyParser from 'body-parser';
import multer from 'multer';
import SongController from './controllers/song-controller';
import CoverController from './controllers/cover-controller';
import express, { 
    Router, 
    Request, 
    Response, 
    NextFunction, 
    Application 
} from 'express';
import {  
    parsePagination, 
    checkForAuthorizationHeader,
    customErrorHandler, 
    validateAPIKey 
} from './middleware/middleware';
import { SongDB, S3BucketClient } from './types/app-types';

const FILE_UPLOAD_MAX_SIZE = 40000;

const initSongRouter = function (controller: SongController): Router {
    const router: Router = Router();

    router.use((request: Request, response: Response, next: NextFunction) => {
        const method: string = request.method;
        
        if (![ 'GET', 'POST', 'PUT', 'DELETE' ].includes(method)) {
            response.status(405).json({ 'error': 'method not supported' });
            return;
        }
        
        next();
    });

    router.get('/', parsePagination, controller.getSongs.bind(controller));
    router.get('/:id', controller.getSong.bind(controller));
    router.get('/Search/:searchTerm', parsePagination, controller.searchSong.bind(controller).bind(controller));
    router.post('/', controller.createSong.bind(controller));
    router.delete("/:id", checkForAuthorizationHeader, controller.deleteSong.bind(controller));
    router.put("/:id", checkForAuthorizationHeader, controller.updateSong.bind(controller));

    return router;
}

const initCoverRouter = function (controller: CoverController): Router {
    const router: Router = Router();

    router.use((request: Request, response: Response, next: NextFunction) => {
        const method: string = request.method;
    
        if (method !== 'POST') {
            response.status(405).json({ 'error': 'method not supported' });
            return;
        }
    
        next();
    });

    router.post('/', controller.uploadFile.bind(controller));

    return router;
}

export default async function configureApp(database: SongDB, s3Client: S3BucketClient) : Promise<express.Application> {

    const app : Application = express();

    //initialize multer
    const upload = multer({ limits: { fileSize: FILE_UPLOAD_MAX_SIZE } });

    app.use(validateAPIKey);

    //Simple and temporary request logger
    app.use((request, response, next) => {
        console.log(`INFO: ${request.method}: URL: ${request.url}`);
        next();
    });

    const songController = new SongController(database);
    
    const songRouter = initSongRouter(songController);
    const coverController = new CoverController(s3Client);
    const coverRouter = initCoverRouter(coverController);

    //set up the song and cover router
    app.use('/api/Song', bodyParser.json(), songRouter);
    app.use('/api/Cover', upload.single('cover-file'), coverRouter);

    app.use((request, response, next) => {
        response.status(404).json({ 'error': 'unsupported route'});
        return;
    });

    //Error handler middleware function
    app.use(customErrorHandler);

    return app;
}
 