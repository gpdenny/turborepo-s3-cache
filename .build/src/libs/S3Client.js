"use strict";
exports.__esModule = true;
exports.s3Client = void 0;
var client_s3_1 = require("@aws-sdk/client-s3");
exports.s3Client = new client_s3_1.S3Client(process.env.IS_OFFLINE ?
    {
        region: 'us-east-1',
        endpoint: 'http://localhost:9000',
        credentials: { accessKeyId: 'minio', secretAccessKey: 'minio123' },
        forcePathStyle: true
    }
    : { region: process.env.AWS_REGION });
