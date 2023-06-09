import { 
    NextFunction, 
    Request, 
    Response 
} from 'express';

//If this function is called it is an internal server error, all other errors will be handled in the routes
export const CustomErrorHandler = function (error: Error, request: Request, response: Response, next: NextFunction) {
    if (response.headersSent) {
        return next(error);
    }

    response.status(500).json({ 'error': error.message})
}   
