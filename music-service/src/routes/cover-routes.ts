import { Router, Request, Response, NextFunction } from 'express';
import { UploadCoverFile } from '../clients/s3-client';

const router: Router = Router();

router.use((request: Request, response: Response, next: NextFunction) => {
    const method: string = request.method;

    if (method !== 'POST') {
        response.status(405).json({ 'error': 'method not supported' });
        return;
    }

    next();
});

router.post("/", async (request: Request, response: Response, next: NextFunction) => {
    const file: Express.Multer.File | undefined = request.file;

    if (!file) {
        response.status(400).json({ 'error': 'cover-file missing from request' });
        return;
    }

    try {
        //send file to s3 bucket client
        const resourceURL: string = await UploadCoverFile(file);

        //return s3 resource url that is returned from the client
        response.status(200).json({ 'data': resourceURL });
    } catch (error) {
        next(error);
    }
});

export default router;