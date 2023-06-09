import express from 'express';
import crypto from 'crypto';
import { 
    Song,
    SongRepository 
} from '../db/song-repository';

const repository: SongRepository = SongRepository.getInstance();

const router: express.Router = express.Router();

router.get('/', (request, response, next) => {
    const songs: Song[] = repository.getAllSongs();
    response.json({ 'data': songs });
});

router.get('/:id', (request, response, next) => {
    const id: string | undefined = request.params.id;

    if (!id) {
        //bad request
        response.status(400).json({ 'error': 'Request is missing the "id" parameter from the path'});
        return; 
    }

    const song: Song | undefined = repository.getSong(id);

    if (!song) {
        //not found
        response.status(404).json({ 'error': `Song with id ${id} not found` });
        return;
    }

    response.json({ 'data': song });
});

router.get('/Search/:searchTerm', (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const searchTerm: string | undefined = request.params.searchTerm

    const results : Song[] = repository.searchSong(searchTerm);

    response.json({ 'data': results })
});

router.post('/', (request: express.Request, response: express.Response, next: express.NextFunction) => {
    try{
      const {
        title,
        author,
        authorId,
        description
      } = request.body;

      if (!title || !author || !authorId) {
        const responseBody = { 
          'error': `one or more required values missing from request body, title: ${title}, author: ${author}, authorId: ${authorId}` 
        }
        response.status(400).json(responseBody)
      }

      const newSong: Song = {
        id: crypto.randomUUID(),
        title: title,
        author: author,
        authorId: authorId,
        description: description,
        createdAt: new Date().toDateString()
      }
      
      repository.AddSong(newSong);
    } catch (error) {
      next(error)
    }
    
    response.status(200).end();
});

router.delete("/:id", (request: express.Request, response: express.Response, next: express.NextFunction) => {
  const id: string = request.params.id;

  try {
    const deletedSong : Song | undefined = repository.DeleteSong(id);

    if (!deletedSong) {
      response.status(400).json({ 'error': `song with id ${id} not found`});
      return;
    }

    response.status(200).json({ 'data': deletedSong });
  } catch (error) {
    next(error);
  }
});

export default router;
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
DELETE: /Song/<id>: Deletes music from the db

GET: /Cover/<id>: Gets a song's cover image 
*/