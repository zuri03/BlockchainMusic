import configureApp from './src/app.js';
import UserDatabase from './src/db/database.js';

(async function () {
    const database = new UserDatabase();
    await database.connectToDatabase();
    const app = await configureApp(database);

    //temp port
    const PORT = 8008;
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