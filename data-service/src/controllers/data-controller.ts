import { Request, Response, NextFunction } from 'express';

export default class DataController {
    private songFilesRootPath: string;

    constructor(songFilesRootPath: string) {
        this.songFilesRootPath = songFilesRootPath;
    }

    getFile(request: Request, response: Response, next: NextFunction) {
    }

    /*
        SONGS
            USER1:
                34sfasdklj32890.mp3
                sksfdjsk329c.mp3
                ...
            USER2:
                sdjsdkljpp392.mp3
                892894387.mp3
                ...
            ...
    */
    /*
        Request Body:
            {
                songid: string (created by song service),
                userid: string (author who created the song)
                File: Multer.file the song data
            }

    */
    createFile(request: Request, response: Response, next: NextFunction) {
        
    }

    deleteFile(request: Request, response: Response, next: NextFunction) {

    }
}