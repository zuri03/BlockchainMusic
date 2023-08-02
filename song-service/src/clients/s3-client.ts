import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from 'crypto';
import { S3BucketClient } from '../types/app-types';

export default class SongServiceS3Client implements S3BucketClient {
    private client: S3Client;
    private s3BucketName: string;

    constructor() {
        const s3BucketRegion: string | undefined = process.env.AWS_BUCKET_REGION;
        const awsAccessKey: string | undefined = process.env.AWS_ACCESS_KEY;
        const awsSecretKey: string | undefined = process.env.AWS_SECRET_KEY;
    
        if (!s3BucketRegion || !awsAccessKey || !awsSecretKey) {
            throw new Error("One or more credentials are missing from the current evironment");
        }
    
        this.client = new S3Client({ 
            region: s3BucketRegion!,
            credentials: {
                accessKeyId: awsAccessKey,
                secretAccessKey: awsSecretKey
            }
        });
    
        if (!process.env.AWS_BUCKET_NAME) {
            throw new Error("Bucket name is not defined");
        }

        this.s3BucketName = process.env.AWS_BUCKET_NAME!;
    }

    async uploadCoverFile(file: Express.Multer.File): string {
        const s3ObjectKey: string = randomUUID();

        const uploadFileCommand: PutObjectCommand = new PutObjectCommand({
            Bucket: this.s3BucketName,
            Key: s3ObjectKey,
            Body: file.buffer
        });

        this.client.send(uploadFileCommand);

        return `https://${process.env.BUCKET_NAME}.s3.${process.env.AWS_BUCKET_REGION}.amazonaws.com/${s3ObjectKey}`;
    }

    destroyS3BucketClient(): void { 
        this.client.destroy();
    }
} 