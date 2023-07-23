import User from '../models/user';

export interface UserDB {
    getUserById(userid: string): Promise<User | null>;
    getUserByUsername(username: string): Promise<User | null>;
    createUser(username: string, password: string): Promise<void>;
}