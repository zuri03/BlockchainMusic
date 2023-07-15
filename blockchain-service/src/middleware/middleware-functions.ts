import { 
    NextFunction, 
    Request, 
    Response 
} from 'express';

export const customErrorHandler = function (error: Error, request: Request, response: Response, next: NextFunction) {
    if (response.headersSent) {
        return next(error);
    }

    console.log(error);

    response.status(500).json({ 'error': 'internal server error' })
}   