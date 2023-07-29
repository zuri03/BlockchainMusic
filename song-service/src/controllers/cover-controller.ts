import { Request, Response, NextFunction } from 'express';
import { S3BucketClient } from '../types/app-types';

export default class CoverController {
    private client: S3BucketClient;

    constructor (client:  S3BucketClient) {
        this.client = client;
    }

    async uploadFile(request: Request, response: Response, next: NextFunction) {
        const file: Express.Multer.File | undefined = request.file;

        if (!file) {
            response.status(400).json({ 'error': 'cover-file missing from request' });
            return;
        }

        try {
            //send file to s3 bucket client
            const resourceURL: string = await this.client.uploadCoverFile(file);

            //return s3 resource url that is returned from the client
            response.status(200).json({ 'data': resourceURL });
        } catch (error) {
            next(error);
        }
    }
}