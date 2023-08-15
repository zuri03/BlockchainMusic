import fetch from 'node-fetch';

interface APIResponse {
    [key: string]: string | undefined,
    data: string | undefined,
    error: string | undefined
}

export default async function sendLoginRequest(username: string, password: string): Promise<string> {
    const userServiceResponse = await fetch('http://user-container:8008/auth', {
        method: 'post',
        headers: { 
            'Content-Type': 'application-json', 
            'Authorization': `Basic ${username}:${password}`,
            'API-KEY': process.env.API_KEY! 
        }
    });

    const responseData: APIResponse = await userServiceResponse.json() as APIResponse;
    if (responseData['error']) {
        throw new Error(responseData['error']);
    }

    return responseData['data']!;
}