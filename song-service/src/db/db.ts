import * as mongoDB from "mongodb";
import Song from "../models/song";

export const collections: { songs?: mongoDB.Collection<Song> } = {};

export async function connectToDatabase() {

    let mongodbUserUsername: string | undefined = process.env.MONGO_USERNAME;
    let mongodbUserPassword: string | undefined = process.env.MONGO_PASSWORD;

    const dbCollectionName = "songs";
    
    if (!mongodbUserPassword || !mongodbUserUsername) {
        throw new Error("Mongo username or password is undefined");
    }

    mongodbUserUsername = encodeURIComponent(mongodbUserUsername!)
    mongodbUserPassword = encodeURIComponent(mongodbUserPassword!)

    const mongodbConnectionString = `mongodb://${mongodbUserUsername}:${mongodbUserPassword}@song-mongo:27017/songs`

    const client = new mongoDB.MongoClient(mongodbConnectionString);

    await client.connect();

    const db = client.db(process.env.MONGO_DB_NAME);

    const songsCollection = db.collection<Song>(dbCollectionName);
    collections.songs = songsCollection;

    console.log(
        `Successfully connected to database: ${db.databaseName} and collection: ${songsCollection.collectionName}`
    );
}
