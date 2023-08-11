import amqplib from 'amqplib';
import NodeCache from 'node-cache';

export default class AuthConsumer {

    private requestTokenCache: NodeCache;
    private connection?: amqplib.Connection;

    constructor (requestTokenCache: NodeCache) {
        this.requestTokenCache = requestTokenCache;
    }

    close(): void {
        this.connection?.close();
    }

    async listen(): Promise<void> {
        console.log('consumer.lisen called')
        const queue = 'tasks';
        this.connection = await amqplib.connect('amqp://localhost');
        console.log('connection set')
        const channel = await this.connection.createChannel();
        await channel.assertQueue(queue);

        console.log('listening on queue')
        // MSG Format: userid:token
        channel.consume(queue, (msg) => {
            if (msg !== null) {
                console.log('Received:', msg.content.toString());
                channel.ack(msg);
                this.insertIntoCache(msg.content.toString());
            } else {
                console.log('Consumer cancelled by server');
            }
        });
    }

    private insertIntoCache(message: string): void {
        const [ userid, token ] = message.split(':');

        if (!userid || !token) {
            //log incorrect message
            console.log(`message format incorrect: original => ${message}`);
            return;
        }

        this.requestTokenCache.set(userid, token);
        console.log(`entry appended to cache, value => ${this.requestTokenCache.get(userid) as string}`)
    }
}