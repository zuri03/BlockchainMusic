import {
    setUp,
    start
} from './src/app.js';

const app = setUp();
start(app);

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
 