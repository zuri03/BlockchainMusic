import configureApp from './src/app.js';

(async function () {

    if (!process.env.API_KEY) {
        throw new Error("Key not defined in the environment");
    }
    
    const app = await configureApp();

    //temp port
    const PORT = 9090;
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