import fetch, { Response } from 'node-fetch';

export default async function sendLoginRequest(username: string, password: string): Promise<Response> {
    return await fetch('http://user-container:8008/auth', {
        method: 'post',
        headers: { 
            'Content-Type': 'application/json', 
            'Authorization': `Basic ${username}:${password}`,
            'API-KEY': process.env.API_KEY! 
        }
    });
}