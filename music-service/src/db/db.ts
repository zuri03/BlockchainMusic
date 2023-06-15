import * as mongoDB from "mongodb";
import Song from "../models/song";

export const collections: { songs?: mongoDB.Collection<Song> } = {};

export async function connectToDatabase() {

    const mongodbUserUsername: string | undefined = process.env.MONGO_USERNAME;
    const mongodbUserPassoword: string | undefined = process.env.MONGO_PASSWORD;

    const dbCollectionName = "songs";
    
    if (!mongodbUserPassoword || !mongodbUserUsername) {
        throw new Error("Mongo username or password is undefined");
    }

    const mongodbConnectionString = `mongodb://${encodeURIComponent(mongodbUserUsername!)}:${encodeURIComponent(mongodbUserPassoword!)}@mongo:27017/songs`
    console.log(mongodbConnectionString);

    const client = new mongoDB.MongoClient(mongodbConnectionString);

    await client.connect();

    const db = client.db(process.env.MONGO_DB_NAME);

    const songsCollection = db.collection<Song>(dbCollectionName);

    // Persist the connection to the Games collection
    collections.songs = songsCollection;

    console.log(
        `Successfully connected to database: ${db.databaseName} and collection: ${songsCollection.collectionName}`,
    );
}
