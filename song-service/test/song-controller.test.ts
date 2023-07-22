import request from 'supertest';
import configureApp from '../src/app';
import MockDB from './mock/mock-db';
import MockClient from './mock/mock-s3Client';
import 'jest';
import { Application } from 'express';
import Song from '../src/models/song';

const initialData = [
    {
        id: "0",
        title: 'title does not exist',
        authorId: 'myId',
        author: 'me',
        description: 'here is a desc'
    },
    {
        id: "1",
        title: 'title does not exist',
        authorId: 'my id',
        author: 'me',
        description: 'wow another description'
    },
    {
        id: "2",
        title: 'made up song',
        authorId: 'some authorid',
        author: 'some author'
    },
    {
        id: "3",
        title: 'made up song',
        authorId: 'aNewId',
        author: 'completely different author'
    }
]

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
        db.resetData(initialData);
    });

    afterAll(() => {
        process.env = original;
        process.env.GATEWAY_API_KEY = testKey;
    });

    test('Get All', async () => {
        const expectedResponse = initialData;

        const response = await request(app)
            .get("/api/Song")
            .set('API-Key', testKey)
            .expect(200);
        expect(response.body.data).toBeDefined()
        expect(response.body.data).toEqual(expectedResponse)
    });
    
    test('Get Song', async () => {
        const expectedResponse = initialData[0];

        const response = await request(app)
            .get("/api/Song/0")
            .set('API-Key', testKey)
            .expect(200);
        expect(response.body.data).toBeDefined();
        expect(response.body.data).toEqual(expectedResponse);
    });
    
    
    test('Search Song', async () => {
        const expectedResponse = [{
            id: "2",
            title: 'made up song',
            authorId: 'some authorid',
            author: 'some author'
        },
        {
            id: "3",
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
});

describe('Song routes write tests', () => {
    const bucketName = 'coverBucket';
    const bucketRegion = 'bucketRegion';

    const client: MockClient = new MockClient(bucketName, bucketRegion);
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
        db.resetData(initialData);
    });

    afterAll(() => {
        process.env = original;
        process.env.GATEWAY_API_KEY = testKey;
    });

    test('Add Song', async () => {
        const spy = jest.spyOn(db, 'createSong');
        const requestBody = {
            title: 'testWriteTitle',
            author: 'testAuthor',
            authorId: 'testId',
            description: 'testDesc'
        };

        await request(app)
                .post('/api/Song')
                .send(requestBody)
                .set('Content-Type', 'application/json')
                .set('API-Key', testKey)
                .set("Authorization", `Basic ${requestBody.authorId}`)
                .set('Accept', 'application/json')
                .expect(200); 

        const response = await request(app)
            .get("/api/Song")
            .set('API-Key', testKey)
            .set('Accept', 'application/json')
            .expect(200); 
        
        expect(response.body.data).toBeDefined();
        expect(response.body.data).toBeInstanceOf(Array<Song>);

        const responseBody = response.body.data;
        expect(responseBody.length).toEqual(initialData.length + 1);

        const { id, title, author, authorId, description }: Song = responseBody[responseBody.length - 1];
        expect(id).toBeDefined();
        expect(title).toEqual(requestBody.title);
        expect(author).toEqual(requestBody.author);
        expect(authorId).toEqual(requestBody.authorId);
        expect(description).toEqual(requestBody.description);
        expect(spy).toBeCalled();
        expect(spy).toBeCalledWith(id, title, author, authorId, description);
    });

    test('Delete Song', async () => {
        const spy = jest.spyOn(db, 'deleteSong');
        await request(app)
            .delete("/api/Song/0")
            .set('API-Key', testKey)
            .set("Authorization", `Basic myId`)
            .set('Accept', 'application/json')
            .expect(200);
        
        expect(spy).toBeCalled();
        expect(spy).toBeCalledWith('0');

        const response = await request(app)
            .get("/api/Song")
            .set('API-Key', testKey)
            .set('Accept', 'application/json')
            .expect(200); 
        
        expect(response.body.data).toBeDefined();
        expect(response.body.data).toBeInstanceOf(Array<Song>);

        const responseBody = response.body.data;
        expect(responseBody.length).toEqual(initialData.length - 1);
    });

    test('Update Song', async () => {
        const spy = jest.spyOn(db, 'updateSong');
        const updatedSong: Song = {
            id: "0",
            title: 'brand new title',
            authorId: 'myId',
            author: 'me',
        };

        await request(app)
            .put("/api/Song/0")
            .send(updatedSong)
            .set('API-Key', testKey)
            .set("Authorization", `Basic myId`)
            .set('Accept', 'application/json')
            .expect(200);
        
        
        expect(spy).toBeCalled();
        expect(spy).toBeCalledWith(updatedSong.id, updatedSong.title, updatedSong.description);

        const response = await request(app)
            .get("/api/Song/0")
            .set('API-Key', testKey)
            .set('Accept', 'application/json')
            .expect(200); 
        
        expect(response.body.data).toBeDefined();
        expect(response.body.data).toBeInstanceOf(Object);

        const responseData = response.body.data;
        expect(responseData['title']).toEqual(updatedSong.title);
        expect(responseData['author']).toEqual(updatedSong.author);
        expect(responseData['authorId']).toEqual(updatedSong.authorId);
        expect(responseData['description']).toBeUndefined();
    });
});
