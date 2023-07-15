import { 
    DynamoDBClient, 
    GetItemCommand, 
    GetItemCommandOutput,
    DeleteItemCommand,
    PutItemCommand
} from '@aws-sdk/client-dynamodb';
import DBEntry from '../models/db-entry';

export var dynamo: BlockchainServiceDynamoClient;

export const configureDynamoDBClient = function () {
    
    const dbRegion: string | undefined = process.env.DB_REGION;
    const awsAccessKey: string | undefined = process.env.AWS_ACCESS_KEY;
    const awsSecretKey: string | undefined = process.env.AWS_SECRET_KEY;

    if (!dbRegion || !awsAccessKey || !awsSecretKey) {
        throw new Error('required values not defined in the environment');
    }

    dynamo = new BlockchainServiceDynamoClient(dbRegion!, awsAccessKey!, awsSecretKey!);
} 

class BlockchainServiceDynamoClient {

    private client: DynamoDBClient;

    constructor(dbRegion: string, accessKey: string, secretKey: string) {
        this.client = new DynamoDBClient({ 
            region: dbRegion,
            credentials: {
                accessKeyId: accessKey,
                secretAccessKey: secretKey,
            } 
        });
    }

    async getDBEntry(useridKey: string): Promise<DBEntry | null> {

        //perhaps hiding the table name isn't necessary but just to be sure
        const tableName: string | undefined = process.env.DB_TABLE_NAME;

        if (!tableName) {
            throw new Error('table name not defined in the environment');
        } 

        const getItemCommand = new GetItemCommand({
            TableName: tableName!,
            Key: { userid: { 'S': useridKey } }
        });

        const dbResponse: GetItemCommandOutput = await this.client.send(getItemCommand);

        let entry: DBEntry | null = null;

        if (!dbResponse.Item) {
            return entry;
        }

        const userid: string | undefined = dbResponse.Item['userid']['S'];
        const address: string | undefined = dbResponse.Item['address']['S'];

        if (!userid || !address) {
            return entry;
        }

        entry = { userid, address }

        return entry;
    }

    async createDBEntry(useridKey: string, contractAddress: string): Promise<void> {
        const tableName: string | undefined = process.env.DB_TABLE_NAME;

        if (!tableName) {
            throw new Error('table name not defined in the environment');
        } 

        const putItemCommand = new PutItemCommand({
            TableName: tableName!,
            Item: {
                userid: { 'S': useridKey },
                address: { 'S': contractAddress }
            }
        });

        await this.client.send(putItemCommand);
    }

    async deleteDBEntry(useridKey: string): Promise<void> {
        const tableName: string | undefined = process.env.DB_TABLE_NAME;

        if (!tableName) {
            throw new Error('table name not defined in the environment');
        } 

        const deleteItemCommand = new DeleteItemCommand({
            TableName: tableName!,
            Key: { userid: { 'S': useridKey } }
        });

        await this.client.send(deleteItemCommand);
    }
}