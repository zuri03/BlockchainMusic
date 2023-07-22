import configureApp from './src/app.js';
import SongServiceS3Client from './src/clients/s3-client.js';
import SongServiceDatabase from './src/db/db';

(async function () {

    if (!process.env.GATEWAY_API_KEY) {
        throw new Error("Key not defined in the environemtn");
    }

    //dependencies
    const database = new SongServiceDatabase();
    await database.configureDatabase();
    const client = new SongServiceS3Client();

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

 