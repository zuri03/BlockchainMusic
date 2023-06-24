import express from 'express';
import { collections } from '../db/database';
import { ObjectId } from 'mongodb';

const router: express.Router = express.Router();

//GET
router.get('/:id', async (request: express.Request, response: express.Response, next: express.NextFunction) => {

    const id: string | undefined = request.params.id;

    if (!id) {
        //bad request
        response.status(400).json({ 'error': 'Request is missing the "id" parameter from the path'});
        return; 
    }

    const mongoQuery = { _id: new ObjectId(id) };

    try{
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
    try{
        const { username, password } = request.body;

        if (!username || !password) {
            const responseBody = { 
            'error': `one or more required values missing from request body` 
            }
            response.status(400).json(responseBody);
            return;
        }

        //hash the password

        //create a new user object

        //store new user in db

        console.log({ username, password });
    } catch (error) {
        next(error);
    }

    response.status(200).end();
});

export default router;