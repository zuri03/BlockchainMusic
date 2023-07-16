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

export const checkAndValidateAuthorizationHeader = function (request: Request, response: Response, next: NextFunction) {
    //check if the auth header even exists
    if (!request.get('authorization')) {
        response.status(400).json({ 'error': 'authorization headers missing' });
        return;
    }

    const requestUserId: string = request.get('authorization')!.split(" ")[1];

    //ensure the auth header value exists
    if (!requestUserId) {
        response.status(400).json({ 'error': 'values missing from auth header' });
        return;
    }

    const uuidRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;

    //validate userid is in uuid format
    if (uuidRegex.test(requestUserId)) {
        response.status(400).json({ 'error': 'auth value in incorrect format' });
        return;
    }

    next();
}

//ensure the user we are deploying a contract for matches the user in the authorization header
export const authorizeReqest = function (request: Request, response: Response, next: NextFunction) {

    //if userid does not exists in the body then check the request params
    const userid: string = request.body['userid'] || request.params.userid;

    if (!userid) {
        response.status(400).json({ 'error': 'resource identifier missing from request' });
        return;
    }

    const requestUserId: string = request.get('authorization')!.split(" ")[1];
    
    //ensure the resource identifier matches the authorization identifier
    if (userid !== requestUserId) {
        response.status(403).json({ 'error': 'not authorized' });
        return;
    }

    next();
}

