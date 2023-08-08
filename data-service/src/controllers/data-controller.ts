import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';

//TODO: Implement authorization functionality
export default class DataController {
    private songFilesRootPath: string;

    constructor(songFilesRootPath: string) {
        this.songFilesRootPath = songFilesRootPath;

        if (!fs.existsSync(this.songFilesRootPath)) {
            fs.mkdirSync(this.songFilesRootPath);
        }
    }

    getFile(request: Request, response: Response, next: NextFunction) {
        console.log(request.params)
        const songid = request.params.sonid;
        const authorid = request.params.authorid;
        if (!songid || !authorid) {
            response.status(400).json({ 'error': 'required values missing from request' });
            return;
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
        console.log(request.params)
        const songid = request.params.songid;
        const authorid = request.params.authorid;
        const file = request.file;
        if (!file || !songid || !authorid) {
            response.status(400).json({ 'error': 'required values missing from request' });
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
        console.log(request.params)
        const songid = request.params.sonid;
        const authorid = request.params.authorid;
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