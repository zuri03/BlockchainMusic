import express from 'express';

export const CustomErrorHandler = function (error: any, request: express.Request, response: express.Response, next: express.NextFunction) {
    if (response.headersSent) {
        return next(error);
    }

    console.log(error)

    response.status(error.statusCode).json({ 'result': 'error handled' })
}   

export const SetAccessControlHeaders = function (error: any, request: express.Request, response: express.Response, next: express.NextFunction) {
    const headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Headers" : "Content-Type",
        "Access-Control-Allow-Origin": "https://zls6563.gitlab.io",
        "Access-Control-Allow-Methods": 'OPTIONS,POST,GET,PATCH'
    };

    response.setHeader("Content-Type", "application/json");
    response.setHeader("Access-Control-Allow-Headers",  "Content-Type");
    response.setHeader("Access-Control-Allow-Origin",  "*");
    response.setHeader("Access-Control-Allow-Methods",  'OPTIONS,POST,GET,PATCH,DELETE');
}