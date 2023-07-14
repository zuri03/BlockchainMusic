import { Router, Request, Response, NextFunction } from 'express';
import Song from '../models/song';
import { Paging, PaginatedResult } from '../models/pagination';
import { 
  AuthorizeRequest, 
  ParsePagination, 
  checkForAuthorizationHeader 
} from '../middleware/middleware';
import { collections } from '../db/db';
import { ObjectId } from 'mongodb';

const router: Router = Router();

router.use((request: Request, response: Response, next: NextFunction) => {
  const method: string = request.method;

  if (![ 'GET', 'POST', 'PUT', 'DELETE' ].includes(method)) {
    response.status(405).json({ 'error': 'method not supported' });
    return;
  }

  next();
});

//GET
router.get('/', ParsePagination, async (request: Request, response: Response, next: NextFunction) => {

  const paging: Paging = response.locals.paging as Paging;

  try {
    const songs = await collections.songs!.find({})
      .sort({ title: 1})
      .skip(paging.offset)
      .limit(paging.pageSize)
      .toArray();

    const results: PaginatedResult = { paging, data: songs }

    response.json(results);

  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (request, response, next) => {
  const id: string | undefined = request.params.id;

  if (!id) {
    //bad request
    response.status(400).json({ 'error': 'Request is missing the "id" parameter from the path'});
    return; 
  }

  try {

    const mongoQuery = { _id: new ObjectId(id) };

    const song = await collections.songs!.findOne(mongoQuery);

    if (!song) {
      //not found
      response.status(404).json({ 'error': `Song with id ${id} not found` });
      return;
    }

    response.json({ 'data': song });
  } catch (error) {
    next(error);
  }
});

router.get('/Search/:searchTerm', ParsePagination, async (request: Request, response: Response, next: NextFunction) => {

  const paging: Paging = response.locals.paging as Paging;
  const searchTerm: string | undefined = request.params.searchTerm

  try {

    const mongoQuery = { 
      $or: [
        { author: { $regex: `^${searchTerm}`, $options: 'i' } }, 
        { title: { $regex: `^${searchTerm}`, $options: 'i' } }
      ] 
    }

    const songs = await collections.songs!.find(mongoQuery)
      .sort({ title: 1})
      .skip(paging.offset)
      .limit(paging.pageSize)
      .toArray();

    const results: PaginatedResult = { paging, data: songs }

    response.json(results);
  } catch (error) {
    next(error);
  }
});

//POST
router.post('/', async (request: Request, response: Response, next: NextFunction) => {
  
  try {

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

//DELETE
router.delete("/:id", checkForAuthorizationHeader, AuthorizeRequest, async (request: Request, response: Response, next: NextFunction) => {

  const id: string = request.params.id;

  try {
    const mongoQuery = {  _id: new ObjectId(id) };

    let deletedSong: Song;
    if (!response.locals.song) {
      deletedSong = await collections.songs!.findOne(mongoQuery) as Song;
    } else {
      deletedSong = response.locals.song
    }

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

//PUT
router.put("/:id", checkForAuthorizationHeader, AuthorizeRequest, async (request: Request, response: Response, next: NextFunction) => {
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
    
    let song: Song;
    if (!response.locals.song) {
      song = await collections.songs!.findOne({ _id: new ObjectId(id) }) as Song;
    } else {
      song = response.locals.song
    }

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

export default router;