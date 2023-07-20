import configureApp from './src/app.js';
import { destroyS3BucketClient } from './src/clients/s3-client.js';
import { connectToDatabase } from './src/db/db';
import { configureS3Client } from './src/clients/s3-client';

(async function () {

    if (!process.env.GATEWAY_API_KEY) {
        throw new Error("Key not defined in the environemtn");
    }

    await connectToDatabase();

    configureS3Client();

    const app = await configureApp();

    //temp port
    const PORT = 8888;
    const server = app.listen(PORT, () => console.log(`server listening on port: ${PORT}`));

    const gracefulServerShutdown = function (signal: string) {
        console.log(`${signal} recieved, shutting down server`);

        console.log('Shutting down s3 connections');
        destroyS3BucketClient();

        console.log('Shutting down API')
        server.close(() => {
            console.log('Server exiting...')
        });
    }

    process.on('SIGTERM', () => gracefulServerShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulServerShutdown('SIGINT'));
})();

 