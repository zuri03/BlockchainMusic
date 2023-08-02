import { Request, Response, NextFunction } from 'express';
import { Paging, PaginatedResult, SongDB } from '../types/app-types';

export default class SongController {
    private songServiceDatabase: SongDB;

    constructor (database: SongDB) {
        this.songServiceDatabase = database;
    }

    async getSongs(request: Request, response: Response, next: NextFunction) {

        const paging: Paging = response.locals.paging as Paging;

        try {
            const count = await this.songServiceDatabase.totalDocumentCount();
            paging.totalCount = count;

            const songs = await this.songServiceDatabase.getSongs(paging.offset, paging.pageSize);

            const results: PaginatedResult = { paging, data: songs }
            response.json(results);
        } catch (error) {
            next(error);
        }
    }

    async getSong(request: Request, response: Response, next: NextFunction) {
        
        const id: string | undefined = request.params.id;

        if (!id) {
            response.status(400).json({ 'error': 'Request is missing the "id" parameter from the path'});
            return; 
        }

        try {
            const song = await this.songServiceDatabase.getSongByID(id);

            if (!song) {
                response.status(404).json({ 'error': `Song with id ${id} not found` });
                return;
            }

            response.json({ 'data': song });
        } catch (error) {
            next(error);
        }
    }

    async searchSong(request: Request, response: Response, next: NextFunction) {

        const paging: Paging = response.locals.paging as Paging;
        const searchTerm: string | undefined = request.params.searchTerm

        try {
            const count = await this.songServiceDatabase.totalDocumentCount();
            paging.totalCount = count;

            const songs = await this.songServiceDatabase.getSongsBySearchTerm(searchTerm);

            const results: PaginatedResult = { paging, data: songs }

            response.json(results);
        } catch (error) {
            next(error);
        }
    }

    async createSong(request: Request, response: Response, next: NextFunction) {
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
    
            await this.songServiceDatabase.createSong(title, author, authorId, description);
            response.status(200).end();
        } catch (error) {
            next(error)
        }
    }

    async deleteSong(request: Request, response: Response, next: NextFunction) {
        const id: string = request.params.id;
        const userid: string = request.get('authorization')!.split(" ")[1];

        try {
            const song = await this.songServiceDatabase.getSongByID(id);

            if (!song) {
                response.status(404).json({ 'error': `song with id ${id} not found`});
                return;
            }

            const authorized = userid === song.authorId;

            if (!authorized) {
                response.status(401).json({ 'error': `Not authorized to modify this resource` });
                return;
            }

            const deletionCount = await this.songServiceDatabase.deleteSong(id);
            
            if (deletionCount === 0) {
            response.status(404).json({ 'error': `song with id ${id} not found`});
            return;
            }

            response.status(200).end();
        } catch (error) {
          next(error);
        }
    }

    async updateSong(request: Request, response: Response, next: NextFunction) {
        try {
            const userid: string = request.get('authorization')!.split(" ")[1];

            const id: string = request.params.id;

            const song = await this.songServiceDatabase.getSongByID(id);

            if (!song) {
                response.status(404).json({ 'error': `song with id ${id} not found`});
                return;
            }

            const authorized = userid === song.authorId;

            if (!authorized) {
                response.status(401).json({ 'error': `Not authorized to modify this resource` });
                return;
            }
        
            const { title, author, authorId, description } = request.body;
        
            if (!title || !author || !authorId) {
                const responseBody = { 
                'error': `one or more required values missing from request body, title: ${title}, author: ${author}, authorId: ${authorId}` 
                }
                response.status(400).json(responseBody);
                return;
            }
        
            await this.songServiceDatabase.updateSong(id, title, description);
            response.status(200).end();
        } catch (error) {
            next(error)
        }
    }
}