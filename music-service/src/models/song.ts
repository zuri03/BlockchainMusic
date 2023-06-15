import { ObjectId } from 'mongodb';

export default interface Song {
    id?: ObjectId,
    title: string,
    author: string,
    authorId: string,
    description?: string | undefined,
    createdAt?: string | undefined,
}