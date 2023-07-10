import express from 'express';
import bcrypt from 'bcrypt';
import { collections } from '../db/database';

const router: express.Router = express.Router();

//POST
router.post('/', async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const { username, password } = request.body;

    if (!username || !password) {
        const responseBody = { 
            'error': `one or more required values missing from request body` 
        }
        console.log(responseBody)
        response.status(400).json(responseBody);
        return;
    }

    try {
        const mongoQuery = { username: { $regex: `${username}`, $options: 'i' } };

        //usernames are unique so there should only be one result to the query
        const result = await collections.users!.findOne(mongoQuery);

        if (!result) {
            //return error to show login credentials could not be found
            //temp error
            const responseBody = { 
                'error': `credentials could not be found` 
            }
            console.log(responseBody)
            response.status(403).json(responseBody);
            return;
        }

        const authenticated = await bcrypt.compare(password, result.password);

        if (!authenticated) {
            console.log({ 'error': 'unauthenticated' })
            response.status(401).json({ 'error': 'unauthenticated' });
            return;
        }

        //return only the userid
        console.log({ 'data': result._id })
        response.status(200).json({ 'data': result._id })
    } catch (error) {
        next(error);
    }
});

export default router;