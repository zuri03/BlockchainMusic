//A client for interacting with the S3 instance
//This client will extract the s3 interaction logic away from the API routes
import { S3Client } from "@aws-sdk/client-s3";

let client: S3Client;

export const configureS3Client = function (): void {
    const s3BucketRegion: string | undefined = process.env.AWS_BUCKET_REGION;

    if (!s3BucketRegion) {
        throw new Error("Bucket region is not set in the current environment");
    }

    client = new S3Client({ region: s3BucketRegion! });
}

//uploads multer file to s3 bucket and returns the URL of the saved resource
export const UploadCoverFile = async function (file: Express.Multer.File): Promise<string> {
    return 'temp URL';
}

//Terminate all open connections and destroy the client gracefully
export const destroyS3BucketClient = function (): void {

}

