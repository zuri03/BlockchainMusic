import { 
    Router,
    Request,
    Response, 
    NextFunction 
} from 'express';
import { AuthenticationProxyMiddleware } from '../middleware/proxy-functions';
//import fetch from 'node-fetch';

const router: Router = Router();

//POST
router.post('/login', AuthenticationProxyMiddleware, async (request: Request, response: Response, next: NextFunction) => {
    console.log('now in login route');

    console.log(response.locals.err)
    if (response.locals.err) {
        response.status(response.locals.status || 500).json({ 'error': response.locals.err });
        return;
    }

    console.log(response.locals.id)
    if (!response.locals.id) {
        response.status(500).json({ 'error': 'internal server error' });
        return;
    }

    console.log('got resposne.local.id ' + response.locals.id)
    request.session.userid = response.locals.id;
    response.status(200).json({ 'data' : 'success' })
    /*
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
    
    console.log('about to do next call')
    //next is the proxy function that will forward the request to the user service and save
    //the response to the response.locals
    next();

    console.log('out of next call')
    console.log(response.locals.id)
    //now pull the userid from response.locals
    request.session.userid = response.locals.id;

    //now save the session
    request.session.save();

    console.log('saved session')
    //if user service returns userid store id in user session and return 200 response to client
    response.status(200).json({ 'data': 'success' });
    */
});

export default router;