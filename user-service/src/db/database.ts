import * as mongoDB from "mongodb";
import User from "../models/user";
import { UserDB } from '../types/app-types';
import { ObjectId } from 'mongodb';

export default class UserDatabase implements UserDB {

    private userCollection?: mongoDB.Collection<User>;

    async connectToDatabase() {

        let mongodbUserUsername: string | undefined = process.env.MONGO_USERNAME;
        let mongodbUserPassword: string | undefined = process.env.MONGO_PASSWORD;
    
        const dbCollectionName = "users";
        
        if (!mongodbUserPassword || !mongodbUserUsername) {
            throw new Error("Mongo username or password is undefined");
        }
    
        mongodbUserUsername = encodeURIComponent(mongodbUserUsername!)
        mongodbUserPassword = encodeURIComponent(mongodbUserPassword!)
    
        const mongodbConnectionString = `mongodb://${mongodbUserUsername}:${mongodbUserPassword}@${encodeURIComponent('user-mongo')}:27017/users`
        
        const client = new mongoDB.MongoClient(mongodbConnectionString);
    
        await client.connect();
    
        const db = client.db(process.env.MONGO_DB_NAME);
    
        this.userCollection = db.collection<User>(dbCollectionName);
    
        console.log(
            `Successfully connected to database: ${db.databaseName} and collection: ${this.userCollection.collectionName}`,
        );
    }

    async getUserById(userid: string): Promise<User | null> {
        const mongoQuery = { _id: new ObjectId(userid) };
        const user = await this.userCollection!.findOne(mongoQuery);
        return user;
    }

    async getUserByUsername(username: string): Promise<User | null> {
        const mongoQuery = { username: { $regex: `${username}`, $options: 'i' } };
        const user = await this.userCollection!.findOne(mongoQuery);
        return user;
    }

    async createUser(username: string, password: string): Promise<void> {
        const user: User = { username, password }
        const insertionExecutionResults = await this.userCollection!.insertOne(user);
        if (!insertionExecutionResults) {
            throw new Error('Unable to complete insertion query');
        }
    }
}