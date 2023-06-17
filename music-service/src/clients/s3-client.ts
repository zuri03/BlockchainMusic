//A client for interacting with the S3 instance
//This client will extract the s3 interaction logic away from the API routes

//This must be called first to configure the client and connect it to s3 bucket
const ConfigureS3Client = function (): void {

}

//uploads multer file to s3 bucket and returns the URL of the saved resource
export const UploadCoverFile = async function (file: Express.Multer.File): Promise<string> {
    return 'temp URL';
}