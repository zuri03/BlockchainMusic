import { ObjectId } from 'mongodb';

export default interface User {
    id?: ObjectId,
    username: string,
    password: string
}
