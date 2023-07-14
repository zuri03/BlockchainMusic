import configureApp from './src/app.js';
import { destroyS3BucketClient } from './src/clients/s3-client.js';

(async function () {
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

 