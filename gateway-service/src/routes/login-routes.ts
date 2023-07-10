import { 
    Router,
    Request,
    Response, 
    NextFunction 
} from 'express';
//import { AuthenticationProxyMiddleware } from '../middleware/proxy-functions';
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
    
    const { username, password } = request.body;

    if (!username || !password) {
        const responseBody = { 
            'error': `one or more required values missing from request body` 
        }
        response.status(400).json(responseBody);
        return;
    }

    try {

        console.log('about to call user service');

        const userServiceResponse = await fetch('http://user-container:8008/auth', {
            method: 'post',
            body: JSON.stringify(request.body),
            headers: { 'Content-Type': 'application-json' }
        });

        const responseData: APIResponse = await userServiceResponse.json() as APIResponse;

        console.log('got response ');
        console.log(responseData);

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

        console.log('saved session userid is now ');

        console.log(request.session.userid);
        response.status(200).json({ 'data': 'success' });
    } catch (error) {
        next(error);
    }
});

export default router;