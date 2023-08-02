import { S3BucketClient } from '../../src/types/app-types';

export default class MockClient implements S3BucketClient {
    private bucketName: string;
    private bucketRegion: string;

    constructor(bucketName: string, bucketRegion: string) {
        this.bucketName = bucketName;
        this.bucketRegion = bucketRegion;
    }

    uploadCoverFile(file: Express.Multer.File): string {
        return `https://${this.bucketName}.s3.${this.bucketRegion}.amazonaws.com/s3ObjectKey`;
    }
    
    destroyS3BucketClient(): void {}
}