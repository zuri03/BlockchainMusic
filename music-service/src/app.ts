import express from 'express'
import bodyParser from 'body-parser';
import songRouter from './routes/song-routes';
import coverRouter from './routes/cover-routes'
import cors from 'cors';
import multer from 'multer';
import { CustomErrorHandler } from './middleware/middleware';
import { connectToDatabase } from './db/db';
import { configureS3Client } from './clients/s3-client';

export default async function configureApp() : Promise<express.Application> {

    await connectToDatabase();

    configureS3Client();
    
    const app : express.Application = express();

    //initialize multer
    const upload = multer();

    app.use(cors());

    //Simple and temporary request logger
    app.use((request, response, next) => {
        console.log(`INFO: ${request.method}: URL: ${request.url}`);
        next();
    });

    //set up the song and cover router
    app.use('/api/Song', bodyParser.json(), songRouter);
    app.use('/api/Cover', upload.single('cover-file'), coverRouter);

    //Error handler middleware function
    app.use(CustomErrorHandler);

    return app;
}

/*
GET: /Song: Gets info on all music available (will need pagination),
GET: /Song/<id>: Gets information for a specific song
GET: /Song/Search/<searchTerm>: Gets all music where the title matches the serach term
POST: /Song: Adds new music to the DB
{
    'id': <id>
    'title': 'example', //song title
    'author': 'example', //username of the user who uploaded the song
    'authorId' <id>, //id of the user who uploaded the song
    'coverURL': <coverURL>, //url of the cover 
    'createdAt': <datetime>, //datetime created on the server
}
DELETE: /Song/<id>: Deletes music from the db
*/
 