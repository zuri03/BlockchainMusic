import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

export const db: { client?: DynamoDBClient } = {};

export const configureDynamoDBClient = function () {
    const dbRegion: string | undefined = process.env.DB_REGION;

    if (!dbRegion) {
        throw new Error('required values not defined in the environment');
    }

    db.client = new DynamoDBClient({ region: dbRegion! });
} 