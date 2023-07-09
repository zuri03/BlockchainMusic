import { 
    NextFunction, 
    Request, 
    Response 
} from 'express';

//If this function is called it is an internal server error, all other errors will be handled in the routes
export const CustomErrorHandler = function (error: Error, request: Request, response: Response, next: NextFunction) {
    console.log(error)
    if (response.headersSent) {
        return next(error);
    }

    response.status(500).json({ 'error': 'internal server error' })
}   

//augment the session module
declare module "express-session" {
    interface SessionData {
        userid: string;
    }
}

export const checkForUserid = function (request: Request, response: Response, next: NextFunction) {
    const isLoggedIn: boolean = request.session.userid !== undefined;

    if ((request.method !== 'GET' || request.path.includes('User')) && !isLoggedIn) {
        response.status(403).json({ 'error': 'please login first' });
        return;
    }
    
    next();
}   
