import { 
    NextFunction, 
    Request, 
    Response 
} from 'express';

const PAGE_LIMIT = 100;
const DEFAULT_OFFSET = 0;
const DEFAULT_PAGE_SIZE = 10;

//If this function is called it is an internal server error, all other errors will be handled in the routes
export const customErrorHandler = function (error: Error, request: Request, response: Response, next: NextFunction) {
    if (response.headersSent) {
        return next(error);
    }

    console.log(error);

    response.status(500).json({ 'error':'internal server error' });
}   

export const checkForAuthorizationHeader = function (request: Request, response: Response, next: NextFunction) {
    if (!request.get('authorization')) {
        response.status(403).json({ 'error': 'authorization headers missing' });
        return;
    }

    const requestUserId: string = request.get('authorization')!.split(" ")[1];

    if (!requestUserId) {
        response.status(403).json({ 'error': 'values missing from auth header' });
        return;
    }

    console.log('Got userid of ' + requestUserId)

    //setting it to the locals may not be necessary
    response.locals.userid = requestUserId;
    next();
}

export const parsePagination = async function (request: Request, response: Response, next: NextFunction) {
    const offset: number = parseInt((request.query.offset || DEFAULT_OFFSET) as string);
    const pageSize: number = parseInt((request.query.pageSize || DEFAULT_PAGE_SIZE) as string);

    if (isNaN(offset) || isNaN(pageSize)) {
        response.status(400).json({ 'error': 'offset and pageSize must be an integer' });
        return;
    } 

    if (pageSize > PAGE_LIMIT) {
        response.status(400).json({ 'error': `pageSize is too large, must be <${PAGE_LIMIT}` });
        return;
    }

    if (pageSize <= 0) {
        response.status(400).json({ 'error': `page size must be <0` });
        return;
    }

    if (offset < 0) {
        response.status(400).json({ 'error': `page size must be greater than or equal to 0` });
        return;
    }

    try {
        response.locals.paging = { offset, pageSize }
        next();
    } catch (error) {
        next(error);
    }
}

export const validateAPIKey = function (request: Request, response: Response, next: NextFunction) {
    
    const apiKey: string | undefined = request.get('API-Key');

    if (!apiKey) {
        response.status(400).json({ 'error': 'missing required values' });
        return;
    }

    if (apiKey !== process.env.GATEWAY_API_KEY!) {
        response.status(403).json({ 'error': 'unathorized' });
        return;
    }

    next();
}
