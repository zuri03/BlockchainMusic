import express from 'express'

export default async function configureApp() : Promise<express.Application> {
    const app : express.Application = express();
    //Simple and temporary request logger
    app.use((request, response, next) => {
        console.log(`INFO: ${request.method}: URL: ${request.url}`);
        next();
    });

    return app;
}
 