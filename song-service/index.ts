import configureApp from './src/app.js';
import SongServiceS3Client from './src/clients/s3-client.js';
import SongServiceDatabase from './src/db/db';
import MockDB from './test/mock/mock-db.js';
import MockClient from './test/mock/mock-s3Client.js';
import { S3BucketClient } from './src/types/app-types.js';

(async function () {

    if (!process.env.NODE_ENV) {
        throw new Error('Configuration environment variable is undefined')
    }

    const environment = process.env.NODE_ENV.trim();

    if (environment === 'production' && !process.env.GATEWAY_API_KEY) {
        throw new Error("Key not defined in the environemtn");
    }

    //dependencies
    let database;
    let client: S3BucketClient;
    if (environment == 'development') {  
        database = new MockDB();
        client = new MockClient('bucket', 'region');
    } else {
        database = new SongServiceDatabase();
        await database.configureDatabase();
        client = new SongServiceS3Client();
    }

    const app = await configureApp(database, client);

    //temp port
    const PORT = 8888;
    const server = app.listen(PORT, () => console.log(`server listening on port: ${PORT}`));

    const gracefulServerShutdown = function (signal: string) {
        console.log(`${signal} recieved, shutting down server`);

        console.log('Shutting down s3 connections');
        client.destroyS3BucketClient();

        console.log('Shutting down API')
        server.close(() => {
            console.log('Server exiting...')
        });
    }

    process.on('SIGTERM', () => gracefulServerShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulServerShutdown('SIGINT'));
})();

 