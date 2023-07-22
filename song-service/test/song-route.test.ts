import request from 'supertest';
import configureApp from '../src/app';
import MockDB from './mock/mock-db';
import MockClient from './mock/mock-s3Client';
import 'jest';
import { ObjectId } from 'mongodb';
import { Application } from 'express';

describe('Testing API Keys', () => {
    const bucketName = 'coverBucket';
    const bucketRegion = 'bucketRegion';

    const client: MockClient = new MockClient(bucketName, bucketRegion);
    const db: MockDB = new MockDB();

    let app: Application;
    const original = process.env;
    const testKey = "KEY";

    beforeAll(async () => {
        app = await configureApp(db, client);
    });

    beforeEach(() => {
        jest.resetModules();
        process.env = { ...original }; 
    });

    afterAll(() => {
        process.env = original;
        process.env.GATEWAY_API_KEY = testKey;
    });

    test('No key provided', async () => {
        const expectedResponse = 'missing required values';

        const response = await request(app).get("/api/Song").expect(400);
        expect(response.body.error).toBeDefined();
        expect(response.body.error).toEqual(expectedResponse);
    });

    test('Incorrect Key', async () => {
        const expectedResponse = 'unathorized';
        const response = await request(app).get("/api/Song")
            .set('API-Key', testKey)
            .expect(403);
        expect(response.body.error).toBeDefined();
        expect(response.body.error).toEqual(expectedResponse);
    });

})

describe('Song routes read test', () => {
    const bucketName = 'coverBucket';
    const bucketRegion = 'bucketRegion';

    const client: MockClient = new MockClient(bucketName, bucketRegion);
    const initialData = [
        {
            //id: new ObjectId("64bb4095fc13ae6174beecb6"),
            id: new ObjectId(0),
            title: 'title does not exist',
            authorId: 'my id',
            author: 'me',
            description: 'here is a desc'
        },
        {
            //id: new ObjectId("64bb4095fc13ae6174beecb0"),
            id: new ObjectId(1),
            title: 'title does not exist',
            authorId: 'my id',
            author: 'me',
            description: 'wow another description'
        },
        {
            //id: new ObjectId("64bb4095fc13ae6174beec77"),
            id: new ObjectId(2),
            title: 'made up song',
            authorId: 'some authorid',
            author: 'some author'
        },
        {
            //id: new ObjectId("64bb4095fc13ae6174beec86"),
            id: new ObjectId(3),
            title: 'made up song',
            authorId: 'aNewId',
            author: 'completely different author'
        }
    ]
    const db: MockDB = new MockDB(initialData);

    let app: Application;
    const original = process.env;
    const testKey = "KEY";

    beforeAll(async () => {
        app = await configureApp(db, client);
    });

    beforeEach(() => {
        jest.resetModules();
        process.env = { ...original }; 
    });

    afterAll(() => {
        process.env = original;
        process.env.GATEWAY_API_KEY = testKey;
    });

    /*
    test('Get All', async () => {
        const expectedResponse = initialData;

        const response = await request(app)
            .get("/api/Song")
            .set('API-Key', testKey)
            .expect(200);
        expect(response.body.data).toBeDefined()
        expect(response.body.data).toEqual(expectedResponse)
    });
    */
    test('Get Song', async () => {
        const expectedResponse = initialData[0];

        const response = await request(app)
            .get("/api/Song/0")
            .set('API-Key', testKey)
            .expect(200);
        expect(response.body.data).toBeDefined();
        expect(response.body.data).toEqual(expectedResponse);
    });
    
    /*
    test('Search Song', async () => {
        const expectedResponse = [{
            //id: new ObjectId("64bb4095fc13ae6174beec77"),
            id: new ObjectId(2),
            title: 'made up song',
            authorId: 'some authorid',
            author: 'some author'
        },
        {
            //id: new ObjectId("64bb4095fc13ae6174beec86"),
            id: new ObjectId(3),
            title: 'made up song',
            authorId: 'aNewId',
            author: 'completely different author'
        }];

        const searchTerm = encodeURIComponent("made up song");

        const response = await request(app)
            .get(`/api/Song/Search/${searchTerm}`)
            .set('API-Key', testKey)
            .expect(200);
        expect(response.body.data).toBeDefined();
        expect(response.body.data).toEqual(expectedResponse);
    });
    */
});

/*
describe('Song routes write tests', async () => {
    const bucketName = 'coverBucket';
    const bucketRegion = 'bucketRegion';

    const client: MockClient = new MockClient(bucketName, bucketRegion);
    const db: MockDB = new MockDB();

    const app = await configureApp(db, client);

    test('Add Song', async () => {
        const requestBody = {
            title: 'testTitle',
            author: 'testAuthor',
            authorId: 'testId',
            description: 'testDesc'
        };

        await request(app)
                .post('/api/Song')
                .send(requestBody)
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .expect(200); 

        const response = await request(app).get("/api/Song/Search/testTitle");
        const responseBody = response.body['data'];

        expect(responseBody).toBeInstanceOf(Array<object>);
        expect(responseBody.length).toEqual(1);

        const responseData = responseBody[0];

        expect(responseData['title']).toEqual(requestBody.title);
        expect(responseData['author']).toEqual(requestBody.author);
        expect(responseData['authorId']).toEqual(requestBody.authorId);
        expect(responseData['description']).toEqual(requestBody.description);
    });

    test('Delete Song', async () => {
        const response = await request(app).delete("/api/Song/1").expect(200);
        const expectedResponse = { 'data': {
            id: '1',
            title: 'title1',
            authorId: 'authorId',
            author: 'author1',
            createdAt: 'createdAt',
            description: 'description'
        }};
        expect(response.body).toEqual(expectedResponse);
    });
});
*/