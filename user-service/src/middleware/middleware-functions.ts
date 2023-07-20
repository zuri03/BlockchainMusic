import { 
    NextFunction, 
    Request, 
    Response 
} from 'express';

export const CustomErrorHandler = function (error: Error, request: Request, response: Response, next: NextFunction) {
    if (response.headersSent) {
        return next(error);
    }

    console.log(error);

    response.status(500).json({ 'error': 'internal server error' })
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