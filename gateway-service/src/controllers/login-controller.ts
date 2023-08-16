import { 
    Request,
    Response, 
    NextFunction 
} from 'express';
import fetch, { Response as FetchResponse } from 'node-fetch';

interface LoginResponseBody {
    [key: string]: string | undefined,
    data: string | undefined,
    error: string | undefined
}

type loginRequest = (username: string, password: string) => Promise<FetchResponse>;

export default class LoginController {
    private sendLoginRequest: loginRequest;

    constructor(sendLoginRequest: loginRequest) {
        this.sendLoginRequest = sendLoginRequest;
    }

    async login(request: Request, response: Response, next: NextFunction) {
         //if the user already has a userid they are already logged in
        if (request.session.userid) {
            //return error or skip this function
            response.status(200).json({ 'data': 'already logged in' });
            return;
        }
        
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
            const loginResponse: FetchResponse = await this.sendLoginRequest(username, password);
        
            if (loginResponse.status === 500) {
                response.status(500).json({ 'error': 'internal server error' });
                return;
            }

            const loginResponseBody = await loginResponse.json() as LoginResponseBody;
            if (loginResponseBody['error']) {
                response.status(loginResponse.status).json(loginResponseBody);
                return;
            }

            const userid = loginResponseBody['data'];
            console.log('got userid ' + userid);
            request.session.userid = userid;
            console.log('set userid to ' + request.session.userid);
            request.session.save();
            console.log('session id is now ' + request.session.userid);
            response.status(200).json({ 'data': 'success' });
        } catch (error) {
            next(error);
        }
    }
}