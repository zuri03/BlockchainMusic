import express from 'express';

export default function CustomErrorHandler (error: any, request: express.Request, response: express.Response, next: express.NextFunction) {
    console.log('in error handler');
    if (response.headersSent) {
        console.log('headers sent')
        return next(error);
    }

    if (response.statusCode === 200) {
        console.log('status is 200')
        return;
    }

    console.log(error)

    response.status(error.statusCode).json({ 'result': 'error handled' })
}   