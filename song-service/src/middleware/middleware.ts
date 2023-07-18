import { 
    NextFunction, 
    Request, 
    Response 
} from 'express';
import { ObjectId } from 'mongodb';
import { collections } from '../db/db';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 3;
const PAGE_LIMIT = 100;
const DEFAULT_OFFSET = 0;
const DEFAULT_PAGE_SIZE = 10;

//If this function is called it is an internal server error, all other errors will be handled in the routes
export const CustomErrorHandler = function (error: Error, request: Request, response: Response, next: NextFunction) {
    if (response.headersSent) {
        return next(error);
    }

    console.log(error);

    response.status(500).json({ 'error':'internal server error' });
}   

export const checkForAuthorizationHeader = function (request: Request, response: Response, next: NextFunction) {
    if (!request.get('authorization')) {
        response.status(403).json({ 'error': 'authorization headers missing' });
        return;
    }

    const requestUserId: string = request.get('authorization')!.split(" ")[1];

    if (!requestUserId) {
        response.status(403).json({ 'error': 'values missing from auth header' });
        return;
    }

    //setting it to the locals may not be necessary
    response.locals.userid = requestUserId;

    next();
}

export const AuthorizeRequest = async function (request: Request, response: Response, next: NextFunction) {

    //at this point we can assume the authorization header is present due to previous middleware
    const authorId: string = request.get('authorization')!.split(" ")[1];

    const id = request.params.id;

    if (!id || !authorId) {
        response.status(400).json({ 'error': 'id or authorid is missing from request' });
        return;
    }

    try {

        const mongoQuery = { _id: new ObjectId(id) };
        const song = await collections.songs!.findOne(mongoQuery);

        if (!song) {
            response.status(404).json({ 'error': `Song with id ${id} not found` });
            return;
        }

        //for now authorid is stored in plain text
        const authorized = authorId === song.authorId

        if (!authorized) {
            response.status(401).json({ 'error': `Not authorized to modify this resource` });
            return;
        }
    
        //set the song in 'locals' so it can be accessed by functions down the middlware pipeline
        response.locals.song = song;
        next();
    } catch (error) {
        next(error);
    }   
} 

export const ParsePagination = async function (request: Request, response: Response, next: NextFunction) {
    const offset: number = parseInt((request.query.offset || DEFAULT_OFFSET) as string);
    const pageSize: number = parseInt((request.query.pageSize || DEFAULT_PAGE_SIZE) as string);

    if (isNaN(offset) || isNaN(pageSize)) {
        response.status(400).json({ 'error': 'offset and pageSize must be an integer' });
        return;
    } 

    if (pageSize > PAGE_LIMIT) {
        response.status(400).json({ 'error': `pageSize is too large, must be <${PAGE_LIMIT}` });
        return;
    }

    if (pageSize <= 0) {
        response.status(400).json({ 'error': `page size must be <0` });
        return;
    }

    if (offset < 0) {
        response.status(400).json({ 'error': `page size must be greater than or equal to 0` });
        return;
    }

    try {

        response.locals.paging = {
            offset: offset,
            pageSize
        }

        next();
    } catch (error) {
        next(error);
    }
}
