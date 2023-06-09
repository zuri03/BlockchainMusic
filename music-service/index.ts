import setUp from './src/app.js';

const app = setUp();

//temp port
const PORT = 8888;
const server = app.listen(PORT, () => console.log(`server listening on port: ${PORT}`));

const gracefulServerShutdown = function (signal: string) {
    console.log(`${signal} recieved, shutting down server`);
    server.close(() => {
        console.log('Server exiting...')
    });
}

process.on('SIGTERM', () => gracefulServerShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulServerShutdown('SIGINT'));
 