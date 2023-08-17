import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import NodeCache from 'node-cache';

export default class DataController {
    private songFilesRootPath: string;
    private requestTokenCache: NodeCache;

    constructor(songFilesRootPath: string, requestTokenCache: NodeCache) {
        this.requestTokenCache = requestTokenCache;
        this.songFilesRootPath = songFilesRootPath;

        if (!fs.existsSync(this.songFilesRootPath)) {
            fs.mkdirSync(this.songFilesRootPath);
        }
    }

    getFile(request: Request, response: Response, next: NextFunction) {
        const songid = request.params.songid;
        const authorid = request.params.authorid;
        if (!songid || !authorid) {
            response.status(400).json({ 'error': 'required values missing from request' });
            return;
        }

        //authorize request by pulling required values and ensuring a match
        const requestUserId: string = request.get('authorization')!.split(" ")[1];
        if (!requestUserId) {
            response.status(403).json({ 'error': 'values missing from auth header' });
            return;
        }
        
        //Check if the user requesting the song is the author themselves, if so skip the authorization process
        if (authorid !== requestUserId) {
            const cacheEntryValue = this.requestTokenCache.get(requestUserId);
            if (!cacheEntryValue) {
                response.status(403).json({ 'error': 'token not in cache' });
                return;
            }

            const resourceToken = request.get('resource-token');
            if (!resourceToken) {
                response.status(403).json({ 'error': 'missing required values' });
                return;
            }

            if (resourceToken !== cacheEntryValue) {
                response.status(403).json({ 'error': 'tokens do not match' });
                return;
            }
        }

        const songFilePath = path.join(this.songFilesRootPath, authorid, `${songid}`);
        if (!fs.existsSync(songFilePath)) {
            response.status(404).json({ 'error': 'file not found' });
            return;
        }

        try {
            response.sendFile(songFilePath);
        } catch (error) {
            next(error);
        }
    }

    createFile(request: Request, response: Response, next: NextFunction) {
        const songid = request.params.songid;
        const authorid = request.params.authorid;
        const file = request.file;
        if (!file || !songid || !authorid) {
            response.status(400).json({ 'error': 'required values missing from request' });
            return;
        }

        const requestUserId: string = request.get('authorization')!.split(" ")[1];
        if (!requestUserId) {
            response.status(400).json({ 'error': 'values missing from auth header' });
            return;
        }

        if (requestUserId !== authorid) {
            response.status(403).json({ 'error': 'not authorized to perform this action' });
            return;
        }

        const songFilesRoot = path.join(this.songFilesRootPath, authorid);
        if (!fs.existsSync(songFilesRoot)) {
            fs.mkdirSync(songFilesRoot);
        }

        const songFilePath = path.join(songFilesRoot, `${songid}`);
        try {
            fs.writeFile(songFilePath, file.buffer, { flag: 'w+' }, function (error) {
                if (error) {
                    console.log(error)
                    response.status(500).json({ 'error': 'internal server error'});
                    return;
                }

                response.status(200).end();
            });
        } catch (error) {
            next(error);
        }
    }

    deleteFile(request: Request, response: Response, next: NextFunction) {
        const songid = request.params.songid;
        const authorid = request.params.authorid;

        const requestUserId: string = request.get('authorization')!.split(" ")[1];
        if (!requestUserId) {
            response.status(400).json({ 'error': 'values missing from auth header' });
            return;
        }

        if (requestUserId !== authorid) {
            response.status(403).json({ 'error': 'not authorized to perform this action' });
            return;
        }

        const songFilePath = path.join(this.songFilesRootPath, authorid, songid);
        if (!fs.existsSync(songFilePath)) {
            response.status(404).json({ 'error': 'song not found' });
            return;
        }

        fs.unlink(songFilePath, function (error) {
            if (error) {
                console.log(error)
                response.status(500).json({ 'error': 'internal server error'});
                return;
            }

            response.status(200).end();
        })
    }
}