import { 
    Router,
    Request,
    Response, 
    NextFunction 
} from 'express';
import fetch from 'node-fetch';

const router: Router = Router();

interface APIResponse {
    [key: string]: string | undefined,
    data: string | undefined,
    error: string | undefined
}

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

        const userServiceResponse = await fetch('http://user-container:8008/auth', {
            method: 'post',
            headers: { 
                'Content-Type': 'application-json', 
                'Authorization': `Basic ${username}:${password}`,
                'API-KEY': process.env.API_KEY! 
            }
        });

        const responseData: APIResponse = await userServiceResponse.json() as APIResponse;

        //First check if an error occurred
        if (responseData['error']) {
            //log error
            console.log(responseData['error']);
            response.status(userServiceResponse.status).json({ 'error': 'error occurred during login' });
            return;
        }

        //update and save the session
        request.session.userid = responseData['data'];
        request.session.save();

        response.status(200).json({ 'data': 'success' });
    } catch (error) {
        next(error);
    }
});

export default router;