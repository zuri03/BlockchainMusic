//A client for interacting with the S3 instance
//This client will extract the s3 interaction logic away from the API routes
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from 'crypto';

let client: S3Client;
let s3BucketName: string | undefined;

export const configureS3Client = function (): void {
    const s3BucketRegion: string | undefined = process.env.AWS_BUCKET_REGION;
    const awsAccessKey: string | undefined = process.env.AWS_ACCESS_KEY;
    const awsSecretKey: string | undefined = process.env.AWS_SECRET_KEY;

    if (!s3BucketRegion || !awsAccessKey || !awsSecretKey) {
        throw new Error("One or more credentials are missing from the current evironment");
    }

    client = new S3Client({ 
        region: s3BucketRegion!,
        credentials: {
            accessKeyId: awsAccessKey,
            secretAccessKey: awsSecretKey
        }
    });

    s3BucketName = process.env.AWS_BUCKET_NAME;

    if (!s3BucketName) {
        throw new Error("Bucket name is not defined");
    }
}

//uploads multer file to s3 bucket and returns the URL of the saved resource
export const UploadCoverFile = async function (file: Express.Multer.File): Promise<string> {
    const s3ObjectKey: string = randomUUID();

    const uploadFileCommand: PutObjectCommand = new PutObjectCommand({
        Bucket: s3BucketName!,
        Key: s3ObjectKey,
        Body: file.buffer
    });

    await client.send(uploadFileCommand);

    return `https://${process.env.BUCKET_NAME}.s3.${process.env.AWS_BUCKET_REGION}.amazonaws.com/${s3ObjectKey}`;
}

//Terminate all open connections and destroy the client gracefully
export const destroyS3BucketClient = (): void => client.destroy();

