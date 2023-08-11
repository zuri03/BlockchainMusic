import configureApp from './src/app';
import NodeCache from 'node-cache';
import path from 'path';
import DataController from './src/controllers/data-controller';
import AuthConsumer from './src/auth/auth-consumer';

(async function () {
    const cache = new NodeCache({ stdTTL: 120 });
    const songFilesRootPath = path.join(process.cwd(), 'songs');
    const controller = new DataController(songFilesRootPath, cache);
    //const consumer = new AuthConsumer(cache);
    const app = configureApp(controller);

    const PORT = 9999;

    //consumer.listen();
    const server = app.listen(PORT, () => console.log(`server listening on port: ${PORT}`));

    const gracefulServerShutdown = function (signal: string) {
        console.log(`${signal} recieved, shutting down server`);
        console.log('Closing consumer...');
        //consumer.close();
        console.log('closing server');
        server.close(() => {
            console.log('Server exiting...')
        });
    }

    process.on('SIGTERM', () => gracefulServerShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulServerShutdown('SIGINT'));
})();

