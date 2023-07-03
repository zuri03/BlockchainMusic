import { 
    Router,
    Request,
    Response, 
    NextFunction 
} from 'express';
import { CustomErrorHandler, checkForUserid } from '../middleware/middleware-functions';

const router: Router = Router();

//POST
router.post('/login', async (request: Request, response: Response, next: NextFunction) => {
    //if the user already has a userid they are already logged in
    if (request.session.userid) {
        //return error or skip this function
    }

    const { username, password } = request.body;

    if (!username || !password) {
        const responseBody = { 
            'error': `one or more required values missing from request body` 
        }
        response.status(400).json(responseBody);
        return;
    }
    
    //send request to user service to authenticate the user

    //if user service returns an error return error

    //if user service returns userid store id in user session and return 200 response to client
    
});

export default router;