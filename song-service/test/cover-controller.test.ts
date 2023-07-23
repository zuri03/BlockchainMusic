import request from 'supertest';
import configureApp from '../src/app';
import MockDB from './mock/mock-db';
import MockClient from './mock/mock-s3Client';
import 'jest';
import { Application } from 'express';
import fs from 'fs';

describe('Testing cover controller', () => {
    let app: Application;
    const original = process.env;
    const bucketName = 'coverBucket';
    const bucketRegion = 'bucketRegion';
    const testKey = "KEY";
    const client: MockClient = new MockClient(bucketName, bucketRegion);
    const db: MockDB = new MockDB();

    beforeAll(async () => app = await configureApp(db, client));

    beforeEach(() => {
        jest.resetModules();
        process.env = { ...original }; 
    });

    afterAll(() => process.env = original);

    test('Upload File', async () => {
        process.env.GATEWAY_API_KEY = testKey;
        const spy = jest.spyOn(client, 'uploadCoverFile');
        const expectedResponse = `https://${bucketName}.s3.${bucketRegion}.amazonaws.com/s3ObjectKey`;
        const fileData: string = fs.readFileSync('./test/testdata/download.png', 'utf-8');
        const fileBuffer: Buffer = Buffer.from(fileData, 'utf-8');
        
        const response = await request(app)
            .post('/api/Cover')
            .set('API-Key', testKey)
            .attach('cover-file', fileBuffer, 'test_file_.txt')
            .expect(200); 
        
        expect(spy).toBeCalled();
        expect(response.body.data).toBeDefined();

        const data = response.body.data;
        expect(data).toEqual(expectedResponse);
    });
});