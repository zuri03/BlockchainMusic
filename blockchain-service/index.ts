import { configureDynamoDBClient } from './src/db/dynamo-db';
import SmartContractDeployer from './src/deployer/deployer';
import configureApp from './src/app';

(function () {

    //configure the dynamo clinet to connect to dynamodb
    //configureDynamoDBClient();

    //Connect the deployer on startup, the instance is not needed here
    SmartContractDeployer.getDeployerInstance();
    
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

