import request from 'supertest';
import configureApp from '../src/app';
import MockDB from './mock/mock-db';
import 'jest';

//When uuid is implemented these tests will need to change to become less strict with the expected results
describe('Song routes read test', async () => {

    const app = await configureApp();

    test('Get All', async () => {
        const expectedResponse = { 'data': [{
            id: '1',
            title: 'title1',
            authorId: 'authorId',
            author: 'author1',
            createdAt: 'createdAt',
            description: 'description'
        },
        {
            id: '2',
            title: 'title2',
            authorId: 'authorId',
            author: 'author2',
            createdAt: 'createdAt',
            description: 'description'
        },
        {
            id: '3',
            title: 'title3',
            authorId: 'authorId',
            author: 'author3',
            createdAt: 'createdAt',
            description: 'description'
        }]} ;

        const response = await request(app).get("/api/Song");
        expect(response.body).toEqual(expectedResponse)
    });

    test('Get Song', async () => {
        const expectedResponse = { 'data': {
            id: '1',
            title: 'title1',
            authorId: 'authorId',
            author: 'author1',
            createdAt: 'createdAt',
            description: 'description'
        }};

        const response = await request(app).get("/api/Song/1").expect(200);
        expect(response.body).toEqual(expectedResponse);
    });

    test('Search Song', async () => {
        const expectedResponse = { 'data': [{
            id: '3',
            title: 'title3',
            authorId: 'authorId',
            author: 'author3',
            createdAt: 'createdAt',
            description: 'description'
        }]};

        const response = await request(app).get("/api/Song/Search/title3").expect(200);
        expect(response.body).toEqual(expectedResponse);
    });

    test('Search Song', async () => {
        const expectedResponse = { 'data': [{
            id: '3',
            title: 'title3',
            authorId: 'authorId',
            author: 'author3',
            createdAt: 'createdAt',
            description: 'description'
        }]};

        const response = await request(app).get("/api/Song/Search/title3");
        expect(response.body).toEqual(expectedResponse);
    });
});

describe('Song routes write tests', async () => {
    const app = await setUp();

    //ensure to reset the instance back to the original 
    beforeEach(() => {
        const songRepository = SongRepository.getInstance();
        songRepository.resetRepository();
    });

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