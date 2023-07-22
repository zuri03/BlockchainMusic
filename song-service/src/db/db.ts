import * as mongoDB from "mongodb";
import Song from "../models/song";
import { SongDB, Paging } from '../types/app-types';

const PAGE_LIMIT = 100;
const DEFAULT_OFFSET = 0;
const DEFAULT_PAGE_SIZE = 10;

export default class SongServiceDatabase implements SongDB {

    private songCollection?: mongoDB.Collection<Song>;

    async configureDatabase() {
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
        this.songCollection = songsCollection;

        console.log(
            `Successfully connected to database: ${db.databaseName} and collection: ${songsCollection.collectionName}`
        );
    }

    async totalDocumentCount(): Promise<number> {
        return await this.songCollection!.countDocuments();
    }

    async getSongs(offset?: number, pageSize?: number): Promise<Song[]> {

        const songs = await this.songCollection!.find({})
            .sort({ title: 1 })
            .skip(offset || DEFAULT_OFFSET)
            .limit(pageSize || DEFAULT_PAGE_SIZE)
            .toArray();

        return songs;
    }

    //getSongByID
    async getSongByID(songid: string): Promise<Song | undefined> {
        const mongoQuery = { _id: new mongoDB.ObjectId(songid) };
        const song = await this.songCollection!.findOne(mongoQuery) as Song | undefined; 
        return song;
    }

    //getSongsBySearch
    async getSongsBySearchTerm(searchTerm: string, offset?: number, pageSize?: number): Promise<Song[]> {
        const mongoQuery = { 
            $or: [
                { author: { $regex: `^${searchTerm}`, $options: 'i' } }, 
                { title: { $regex: `^${searchTerm}`, $options: 'i' } }
            ] 
        }

        const songs = await this.songCollection!.find(mongoQuery)
            .sort({ title: 1})
            .skip(offset || DEFAULT_OFFSET)
            .limit(pageSize || DEFAULT_PAGE_SIZE)
            .toArray();
        
        return songs;
    }

    //createSong
    async createSong(id: string, title: string, author: string, authorId: string, description?: string): Promise<void> {
        const newSong: Song = {
            id,
            title,
            author,
            authorId,
            createdAt: new Date().toISOString()
        }

        if (description) {
            newSong.description = description;
        }

        const queryExecutionResult = await this.songCollection!.insertOne(newSong);

        if (!queryExecutionResult) {
            throw new Error('Error executing insert query');
        }
    }
    
    //deleteSong
    async deleteSong(songid: string): Promise<number> {
        const mongoQuery = {  _id: new mongoDB.ObjectId(songid) };

        const deletetionResult = await this.songCollection!.deleteOne(mongoQuery);

        if (!deletetionResult) {
            throw new Error('Error executing delete query');
        }

        return deletetionResult.deletedCount;
    }

    //updateSong
    async updateSong(songid: string, title: string, description?: string): Promise<void> {
        let song = await this.getSongByID(songid);

        if (!song) {
            throw new Error("Cannot find song with id");
        }

        song.title = title;
        if (description) {
            song.description = description;
        }

        const queryExecutionResult = await this.songCollection!.updateOne(
            { _id: new mongoDB.ObjectId(songid) }, { $set: song });

        if (!queryExecutionResult) {
            throw new Error('Unable to complete update query')
        }
    }
}
