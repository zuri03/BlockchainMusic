import { 
    Router,
    Request,
    Response, 
    NextFunction 
} from 'express';
import sendLoginRequest from '../auth';

const router: Router = Router();

//POST
router.post('/login', async (request: Request, response: Response, next: NextFunction) => {
    //if the user already has a userid they are already logged in
    if (request.session.userid) {
        //return error or skip this function
        response.status(200).json({ 'data': 'already logged in' });
        return;
    }
    
    //const { username, password } = request.body;
    if (!request.get('authorization')) {
        response.status(403).json({ 'error': 'missing auth credentials' });
        return;
    }

    const authorizationHeader: string = request.get('authorization')!;

    if (authorizationHeader.split(" ").length !== 2) {
        response.status(400).json({ 'error': `auth header malformed` });
        return;
    }

    //Basic username:password
    const [ username, password ] = authorizationHeader.split(" ")[1].split(":");

    if (!username || !password) {
        const responseBody = { 
            'error': `one or more required values missing from request body` 
        }
        response.status(400).json(responseBody);
        return;
    }

    try {
        /*
        //const userid = await sendLoginRequest(username, password);
        request.session.userid = userid;
        request.session.save();
        */
        response.status(200).json({ 'data': 'success' });
    } catch (error) {
        next(error);
    }
});

export default router;