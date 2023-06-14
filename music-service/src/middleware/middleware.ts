import { 
    NextFunction, 
    Request, 
    Response 
} from 'express';
import { SongRepository, Song } from '../db/song-repository';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 3;

const repository: SongRepository = SongRepository.getInstance();

//If this function is called it is an internal server error, all other errors will be handled in the routes
export const CustomErrorHandler = function (error: Error, request: Request, response: Response, next: NextFunction) {
    if (response.headersSent) {
        return next(error);
    }

    response.status(500).json({ 'error': error.message })
}   

export const AuthorizeRequest = async function (request: Request, response: Response, next: NextFunction) {
    const id = request.params.id;
    const { authorId } = request.body;

    if (!id || !authorId) {
        response.status(400).json({ 'error': 'id or authorid is missing from request' });
        return;
    }

    let song: Song | undefined = repository.getSong(id);

    if (!song) {
        //not found
        response.status(404).json({ 'error': `Song with id ${id} not found` });
        return;
    }

    try {
        const authorIdHash = await bcrypt.hash(authorId, SALT_ROUNDS);
        const authorized = await bcrypt.compare(song.authorId, authorIdHash);

        if (!authorized) {
            //not found
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
