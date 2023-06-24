import { 
    NextFunction, 
    Request, 
    Response 
} from 'express';

export const CustomErrorHandler = function (error: Error, request: Request, response: Response, next: NextFunction) {
    if (response.headersSent) {
        return next(error);
    }

    response.status(500).json({ 'error': error.message })
}   
 


