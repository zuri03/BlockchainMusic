import request from 'supertest';
import {
    setUp,
    start
} from '../src/app';
import 'jest';

describe('Song Route Happy Path Tests', () => {
    const app = setUp();
    start(app);

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

        const response = await request(app).get("/api/Song/1");
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
})