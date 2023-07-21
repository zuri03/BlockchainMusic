//import express, { Router } from 'express'
import bodyParser from 'body-parser';
import coverRouter from './routes/cover-routes'
import cors from 'cors';
import multer from 'multer';
import { CustomErrorHandler, validateAPIKey } from './middleware/middleware';
import SongController from './controllers/song-controller';
import express, { 
    Router, 
    Request, 
    Response, 
    NextFunction, 
    Application 
} from 'express';
import { 
    AuthorizeRequest, 
    ParsePagination, 
    checkForAuthorizationHeader 
} from './middleware/middleware';
import { SongDB } from './types/app-types';

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

    router.get('/', ParsePagination, controller.getSongs);
    router.get('/:id', controller.getSong);
    router.get('/Search/:searchTerm', ParsePagination, controller.searchSong);
    router.post('/', controller.createSong);
    router.delete("/:id", checkForAuthorizationHeader, AuthorizeRequest, controller.deleteSong);
    router.put("/:id", checkForAuthorizationHeader, AuthorizeRequest, controller.deleteSong);

    return router;
}

export default async function configureApp(database: SongDB) : Promise<express.Application> {

    const app : Application = express();

    //initialize multer
    const upload = multer({ limits: { fileSize: FILE_UPLOAD_MAX_SIZE } });

    app.use(cors());

    app.use(validateAPIKey);

    //Simple and temporary request logger
    app.use((request, response, next) => {
        console.log(`INFO: ${request.method}: URL: ${request.url}`);
        next();
    });

    const controller = new SongController(database);

    const songRouter = initSongRouter(controller);

    //set up the song and cover router
    app.use('/api/Song', bodyParser.json(), songRouter);
    app.use('/api/Cover', upload.single('cover-file'), coverRouter);

    app.use((request, response, next) => {
        response.status(404).json({ 'error': 'unsupported route'});
        return;
    });

    //Error handler middleware function
    app.use(CustomErrorHandler);

    return app;
}
 