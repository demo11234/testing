import { S3 } from 'aws-sdk';
import { Injectable } from '@nestjs/common';
import 'dotenv/config';


@Injectable()
export class FileUpload {
    /**
   * @description it will genrate a singed url for s3 bucket
   * @param fileName
   * @param fileType
   * @returns will return signed url
   * @author Vipin
   */

    async signedUrl(fileName , fileType):Promise<any>{
        const s3 = new S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_S3_REGION,
            signatureVersion: 'v4',
        });

        let params = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: `${Date.now()}-${fileName}`,
            Expires: 60,
            ContentType: fileType
        };

        let uploadUrl = await s3.getSignedUrlPromise('putObject', params)
        return uploadUrl;
    }
}