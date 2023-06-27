import express from 'express';
import bcrypt from 'bcrypt';
import { collections } from '../db/database';
import { ObjectId } from 'mongodb';
import User from '../models/user';

const SALT_ROUNDS = 10;

const router: express.Router = express.Router();

//GET
router.get('/:id', async (request: express.Request, response: express.Response, next: express.NextFunction) => {

    const id: string | undefined = request.params.id;

    if (!id) {
        //bad request
        response.status(400).json({ 'error': 'Request is missing the "id" parameter from the path'});
        return; 
    }

    try{

        const mongoQuery = { _id: new ObjectId(id) };

        //search db based on id
        const user = await collections.users!.findOne(mongoQuery);

        if (!user) {
            //not found
            response.status(404).json({ 'error': `User with id ${id} not found` });
            return;
        }

        response.json({ 'data': user });
    } catch (error) {
        next(error);
    }
});

//POST
router.post('/', async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    
    const { username, password } = request.body;

    if (!username || !password) {
        const responseBody = { 
            'error': `one or more required values missing from request body` 
        }
        response.status(400).json(responseBody);
        return;
    }

    try {
        //hash the password
        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
        
        //create a new user object
        const user: User = {
            username,
            password: passwordHash
        }

        //store new user in db
        const insertionExecutionResults = await collections.users!.insertOne(user);

        if (!insertionExecutionResults) {
            response.status(500).json({ 'error': 'internal server error' });
            return;
        }
    } catch (error) {
        next(error);
    }

    response.status(200).end();
});

export default router;