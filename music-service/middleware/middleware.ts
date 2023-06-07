import express from 'express';

export const CustomErrorHandler = function (error: any, request: express.Request, response: express.Response, next: express.NextFunction) {
    if (response.headersSent) {
        return next(error);
    }

    console.log(error)

    response.status(error.statusCode).json({ 'result': 'error handled' })
}   
