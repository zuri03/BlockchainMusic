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

    response.status(500).json({ 'error': error.message })
}   

//augment the session module
declare module "express-session" {
    interface SessionData {
        userid: string;
    }
}

export const checkForUserid = function (error: Error, request: Request, response: Response, next: NextFunction) {
    if (request.session.userid) {
        next();
    }

    response.status(403).json({ 'error': 'please login first' });
}   
