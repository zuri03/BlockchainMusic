import * as mongoDB from "mongodb";
import User from "../models/user";

export const collections: { users?: mongoDB.Collection<User> } = {};

export async function connectToDatabase() {

    let mongodbUserUsername: string | undefined = process.env.MONGO_USERNAME;
    let mongodbUserPassword: string | undefined = process.env.MONGO_PASSWORD;

    const dbCollectionName = "users";
    
    if (!mongodbUserPassword || !mongodbUserUsername) {
        throw new Error("Mongo username or password is undefined");
    }

    mongodbUserUsername = encodeURIComponent(mongodbUserUsername!)
    mongodbUserPassword = encodeURIComponent(mongodbUserPassword!)

    const mongodbConnectionString = `mongodb://${mongodbUserUsername}:${mongodbUserPassword}@mongo:27017/users`

    const client = new mongoDB.MongoClient(mongodbConnectionString);

    await client.connect();

    const db = client.db(process.env.MONGO_DB_NAME);

    const usersCollection = db.collection<User>(dbCollectionName);
    collections.users = usersCollection;

    console.log(
        `Successfully connected to database: ${db.databaseName} and collection: ${usersCollection.collectionName}`,
    );
}
