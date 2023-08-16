import { UserDB } from '../types/app-types';
import {
    Request,
    Response,
    NextFunction
} from 'express';
import bcrypt from 'bcrypt';

export default class AuthController {
    private database: UserDB;

    constructor(database: UserDB) {
        this.database = database;
    }

    async authenticate(request: Request, response: Response, next: NextFunction) {
        if (!request.get('authorization')) {
            response.status(403).json({ 'error': 'missing auth credentials headers' });
            return;
        }
    
        const authorizationHeader: string = request.get('authorization')!;
        const [ username, password ] = authorizationHeader.split(" ")[1].split(":");
    
        if (!username || !password) {
            const responseBody = { 
                'error': `one or more required values missing from header` 
            }
            response.status(400).json(responseBody);
            return;
        }
    
        try {
            const result = await this.database.getUserByUsername(username);
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
            
            console.log('returing the userid ' + result._id);
            response.status(200).json({ 'data': result._id });
        } catch (error) {
            next(error);
        }
    }
}