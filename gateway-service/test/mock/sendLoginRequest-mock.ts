import { Response } from 'node-fetch';
export default async function sendLoginRequestMock(username: string, password: string): Promise<Response>{
    if (username !== 'username' || password !== 'password') {
        const body = JSON.stringify({ 'error': 'credentials could not be found' });
        return new Response(body, { status: 403 });
    }

    const body = JSON.stringify({ 'data': 'testID' });
    return new Response(body, { status: 200 });
}