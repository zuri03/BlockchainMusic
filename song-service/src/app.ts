import express from 'express'
import bodyParser from 'body-parser';
import songRouter from './routes/song-routes';
import coverRouter from './routes/cover-routes'
import cors from 'cors';
import multer from 'multer';
import { CustomErrorHandler, validateAPIKey } from './middleware/middleware';


const FILE_UPLOAD_MAX_SIZE = 40000;

export default async function configureApp() : Promise<express.Application> {

    const app : express.Application = express();

    //initialize multer
    const upload = multer({ limits: { fileSize: FILE_UPLOAD_MAX_SIZE } });

    app.use(cors());

    app.use(validateAPIKey);

    //Simple and temporary request logger
    app.use((request, response, next) => {
        console.log(`INFO: ${request.method}: URL: ${request.url}`);
        next();
    });

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
 