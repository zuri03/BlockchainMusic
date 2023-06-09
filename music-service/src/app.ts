import express from 'express'
import bodyParser from 'body-parser';
import songRouter from './routes/song-routes';
import authorRouter from './routes/song-routes'
import cors from 'cors';
import {
    CustomErrorHandler
} from './middleware/middleware';

export default function setUp() : express.Application {
    const app : express.Application = express();

    //allow the api to parse json bodies for post requests
    app.use(bodyParser.json());

    app.use(cors());

    //Simple and temporary request logger
    app.use((request, response, next) => {
        console.log(`INFO: ${request.method}: URL: ${request.url}`);
        next();
    });

    //set up the music router
    app.use('/api/Song', songRouter);

    //set up the author router
    app.use('/api/Author', authorRouter)

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
    'cover': <coverId>, //id of the cover image for the song (may not be included)
    'createdAt': <datetime>, //datetime created on the server
}
DELETE: /Music/<id>: Deletes music from the db

The author routes may not be necessary
GET: /Author: Gets informaiton on all authors
GET: /Author/<id>: Gets information on a specific artist
GET: /Author/Search/<searchTerm>: Gets info on all artists that match a search term
GET: /Cover/<id>: Gets a song's cover image 

*/
 