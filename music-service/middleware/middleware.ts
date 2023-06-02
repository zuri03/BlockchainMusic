import express from 'express';

export default function CustomErrorHandler (error: any, request: express.Request, response: express.Response, next: express.NextFunction) {
    if (response.headersSent) {
        return next(error);
    }

    console.log(error)

    response.status(error.statusCode).json({ 'result': 'error handled' })
}   