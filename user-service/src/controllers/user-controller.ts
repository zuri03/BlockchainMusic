import { UserDB } from '../types/app-types';
import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';
import User from '../models/user';

const SALT_ROUNDS = 10;

export default class UserController {
    
    private userServiceDatabase: UserDB;

    constructor(database: UserDB) {
        this.userServiceDatabase = database;
    }

    async getUser(request: Request, response: Response, next: NextFunction) {

        const id: string | undefined = request.params.id;

        if (!id) {
            response.status(400).json({ 'error': 'Request is missing the "id" parameter from the path'});
            return; 
        }

        try{
            const user = await this.userServiceDatabase.getUserById(id);

            if (!user) {
                response.status(404).json({ 'error': `User with id ${id} not found` });
                return;
            }

            response.json({ 'data': user });
        } catch (error) {
            next(error);
        }
    }

    async createUser(request: Request, response: Response, next: NextFunction) {
        
        const { username, password } = request.body;

        if (!username || !password) {
            const responseBody = { 
                'error': `one or more required values missing from request body` 
            }
            response.status(400).json(responseBody);
            return;
        }

        try {
            const user = await this.userServiceDatabase.getUserByUsername(username);

            if (user) {
                //resource exists
                response.status(409).json({ 'error': `resource already exists` });
                return;
            }
        } catch (error) {
            next(error);
        }

        try {
            //hash the password
            const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
            await this.userServiceDatabase.createUser(username, passwordHash);
        } catch (error) {
            next(error);
        }

        response.status(200).end();
    }
}