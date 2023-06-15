import express from 'express';
import Song from '../models/song';
import { AuthorizeRequest } from '../middleware/middleware';
import { collections } from '../db/db';
import { ObjectId } from 'mongodb';

const router: express.Router = express.Router();

//Default '/' route
router.get('/', async (request: express.Request, response: express.Response, next: express.NextFunction) => {
  const songs = await collections.songs!.find({}).toArray();
  response.json({ 'data': songs });
});

router.post('/', async (request: express.Request, response: express.Response, next: express.NextFunction) => {
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
      response.status(400).json(responseBody);
      return;
    }

    const newSong: Song = {
      title: title,
      author: author,
      authorId: authorId,
      description: description,
      createdAt: new Date().toISOString()
    }

    const queryExecutionResult = await collections.songs!.insertOne(newSong);

    if (!queryExecutionResult) {
      response.status(500).json({ 'error': 'internal server error' });
      return;
    }
  } catch (error) {
    next(error)
  }
  
  response.status(200).end();
});

// /:id Routes that reference a specific song
router.get('/:id', async (request, response, next) => {
    const id: string | undefined = request.params.id;

    if (!id) {
        //bad request
        response.status(400).json({ 'error': 'Request is missing the "id" parameter from the path'});
        return; 
    }

    const mongoQuery = { _id: new ObjectId(id) };
    const song = await collections.songs!.findOne(mongoQuery);

    if (!song) {
        //not found
        response.status(404).json({ 'error': `Song with id ${id} not found` });
        return;
    }

    response.json({ 'data': song });
});

router.delete("/:id", async (request: express.Request, response: express.Response, next: express.NextFunction) => {

  const id: string = request.params.id;

  try {
    const mongoQuery = {  _id: new ObjectId(id) };
    const deletedSong = await collections.songs!.findOne(mongoQuery);
    const deletetionResult = await collections.songs!.deleteOne(mongoQuery);

    if (!deletetionResult) {
      response.status(400).json({ 'error': `failed to remove song with id ${id}`});
      return;
    }

    if (!deletetionResult.deletedCount) {
      response.status(404).json({ 'error': `song with id ${id} not found`});
      return;
    }

    response.status(200).json({ 'data': deletedSong });
  } catch (error) {
    next(error);
  }
});

router.put("/:id", AuthorizeRequest, async (request: express.Request, response: express.Response, next: express.NextFunction) => {
  try{
    const id: string = request.params.id;

    const { title, author, authorId, description } = request.body;

    if (!title || !author || !authorId) {
      const responseBody = { 
        'error': `one or more required values missing from request body, title: ${title}, author: ${author}, authorId: ${authorId}` 
      }
      response.status(400).json(responseBody);
      return;
    }

    const song: Song = response.locals.song;
    song.title = title;
    song.description = description;

    const queryExecutionResult = await collections.songs!.updateOne({ _id: new ObjectId(id) }, { $set: song });

    if (!queryExecutionResult) {
      response.status(304).json({ 'error': `unable to update resource with id ${id} `});
      return;
    }
  } catch (error) {
    next(error)
  }
  
  response.status(200).end();
});

// "/Search/:searchTerm" routes
router.get('/Search/:searchTerm', async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const searchTerm: string | undefined = request.params.searchTerm

    const mongoQuery = { 
      $or: [{ author: { $regex: `^${searchTerm}` } }, { title: { $regex: `^${searchTerm}` } }] 
    }
    const results = await collections.songs!.find(mongoQuery).toArray();

    response.json({ 'data': results })
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