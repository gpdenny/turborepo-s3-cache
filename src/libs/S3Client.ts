import { S3Client } from '@aws-sdk/client-s3';

export const s3Client = new S3Client(
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  process.env.IS_OFFLINE
    ? {
        region: 'us-east-1',
        endpoint: 'http://localhost:9000',
        credentials: { accessKeyId: 'minio', secretAccessKey: 'minio123' },
        forcePathStyle: true
      }
    : { region: process.env.AWS_REGION }
);
