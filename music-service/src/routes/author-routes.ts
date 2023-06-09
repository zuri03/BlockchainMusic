import express from 'express';
import { 
    SongRepository 
} from '../db/song-repository';

const repository: SongRepository = SongRepository.getInstance();

const router: express.Router = express.Router();

router.get('/Author', (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const authors = repository.getAllAuthors();
    response.json({ 'data': authors });
});

router.get('/Author/:id', (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const id: string | undefined = request.params.id;

    if (!id) {
        //bad request
        response.status(400).json({ 'error': 'Request is missing the "id" parameter from the path'});
        return; 
    }

    const author = repository.getAuthor(id);

    if (!author) {
        //not found
        response.status(404).json({ 'error': `Author with id ${id} not found` });
        return;
    }

    response.json({ 'data': author });
});

router.get('/Author/Search/:searchTerm', (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const searchTerm: string | undefined = request.params.searchTerm

    const results = repository.searchSong(searchTerm);

    response.json({ 'data': results })
});

export default router;

/*
The author routes may not be necessary
GET: /Author: Gets informaiton on all authors
GET: /Author/<id>: Gets information on a specific artist
GET: /Author/Search/<searchTerm>: Gets info on all artists that match a search term
*/