import express from 'express'
import bodyParser from 'body-parser';
import router from './routes/music-routes.js';
import CustomErrorHandler from './middleware/middleware.js';

//temp port
const PORT = 8888;
const app : express.Application = express();

//allow the api to parse json bodies for post requests
app.use(bodyParser.json());

//set up the music router
app.use('/api/', router);

//Error handler middleware function
app.use(CustomErrorHandler);

app.listen(PORT, () => console.log(`server listening on port: ${PORT}`));

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
DELETE: /Author/<id>: Deletes a specific artist
POST: /Author
{
    'id': <id> //id of the user
    'name': string //username of the author
    'songs': [<ids>] // array of ids of songs uploaded by the artists
}

GET: /Cover/<id>: Gets a song's cover image 

User: (not all users are authors but all authors are users)
{
    'id': <id> //id generated by our system
    'username': string, //this will become 'author' for every Music object this user uploads
    'password': //some sort of password managment
    'createdAt': datetime
}

*/
 