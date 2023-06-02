import express from 'express';
import { 
    Song,
    SongRepository 
} from '../db/song-repository.js';

const repository: SongRepository = new SongRepository();

const router: express.Router = express.Router();

router.get('/Author', (request: express.Request, response: express.Response, next: express.NextFunction) => {
});

router.get('/Author/:id', (request: express.Request, response: express.Response, next: express.NextFunction) => {
});

router.get('/Author/Search/:searchTerm', (request: express.Request, response: express.Response, next: express.NextFunction) => {
});

router.delete('/Author/:id', (request: express.Request, response: express.Response, next: express.NextFunction) => {
});

router.post('/Author', (request: express.Request, response: express.Response, next: express.NextFunction) => {
});

export default router;

/*
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
*/