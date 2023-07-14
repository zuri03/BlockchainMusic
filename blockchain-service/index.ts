import { configureDynamoDBClient } from './src/db/dynamo-db';
import configureApp from './src/app';

(function () {

    configureDynamoDBClient();
    
    const app = configureApp();

    const PORT = 9999;
    const server = app.listen(PORT, () => console.log(`server listening on port: ${PORT}`));

    const gracefulServerShutdown = function (signal: string) {
        console.log(`${signal} recieved, shutting down server`);
        server.close(() => {
            console.log('Server exiting...')
        });
    }

    process.on('SIGTERM', () => gracefulServerShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulServerShutdown('SIGINT'));
})();