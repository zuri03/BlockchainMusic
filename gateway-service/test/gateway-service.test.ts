import 'jest';
import request from 'supertest';
import { Application } from 'express';
import configureApp from '../src/app';
import LoginController from '../src/controllers/login-controller';
import sendLoginRequestMock from './mock/sendLoginRequest-mock';

describe('Testing login', () => {
    let app: Application;
    const controller = new LoginController(sendLoginRequestMock);
    const originalEnv = process.env;
    
    process.env.SESSION_SECRET = "TEST_SECRET";

    beforeAll(async () => {
        app = await configureApp(controller);
    });

    beforeEach(() => {
        jest.resetModules();
        process.env = { ...originalEnv };
    });

    afterAll(() => {
        process.env = originalEnv;
    });

    test('No header provided', async () => {
        
        const expectedResponseBody = 'missing auth credentials'

        const response = await request(app)
            .post('/login')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .expect(403); 

        expect(response.body.error).toBeDefined();
        expect(response.body.error).toEqual(expectedResponseBody);
    });

    test('Malformed auth header', async () => {
        const expectedResponseBody = `one or more required values missing from request body` 

        const response = await request(app)
            .post('/login')
            .set('Content-Type', 'application/json')
            .set("authorization", 'Basic usernamepassword')
            .set('Accept', 'application/json')
            .expect(400); 

        expect(response.body.error).toBeDefined();
        expect(response.body.error).toEqual(expectedResponseBody);
    });

    test('Valid login path', async () => {
        const expectedResponseBody = 'already logged in'

        const iniatialResponse = await request(app)
            .post('/login')
            .set('Content-Type', 'application/json')
            .set("authorization", 'Basic username:password')
            .set('Accept', 'application/json')
            .expect(200); 

        const cookie = iniatialResponse.headers['set-cookie'][0].split(';')[0];

        const response = await request(app)
            .post('/login')
            .set('Content-Type', 'application/json')
            .set('cookie', cookie)
            .set("Authorization", 'Basic username:password')
            .set('Accept', 'application/json')
            .expect(200); 

        expect(response.body.data).toBeDefined();
        expect(response.body.data).toEqual(expectedResponseBody);
    });
});

describe('Testing proxy functionality', () => {
    let app: Application;
    const controller = new LoginController(sendLoginRequestMock);
    beforeAll(async () => {
        app = await configureApp(controller);
    });

    test('Proxy Requests', async () => {
        const response = await request(app)
            .get("/login")
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .expect(400)
        
        console.log(response.redirect);
        console.log(response.redirects);

        expect(response.statusCode).toEqual(400);
    });
});