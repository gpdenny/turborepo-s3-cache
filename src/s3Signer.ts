import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { s3Client } from "./libs/S3Client";

const region = process.env.REGION;

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  const method = event.headers['access-control-request-method'] || event.headers['Access-Control-Request-Method'];
  const team = event.queryStringParameters?.slug ?? '';
  const hash = event.pathParameters?.hash ?? '';

  var command: PutObjectCommand | GetObjectCommand;
  var redirect = '';

  const params = {
    Bucket: process.env.CACHE_BUCKET,
    Key: `${team}/${hash}`
  }

  try {
    if (method == 'PUT') {
      command = new PutObjectCommand({
        ...params,
        ACL: 'private'
      });
      redirect = await getSignedUrl(s3Client, command, { expiresIn: 60 });
      return {
        statusCode: 200,
        headers: {
          Location: redirect,
        },
        body: ''
      };

    } else if (method == 'GET') {
      command = new GetObjectCommand(params);
      redirect = await getSignedUrl(s3Client, command, { expiresIn: 60 });
      return {
        statusCode: 200,
        headers: {
          Location: redirect,
        },
        body: ''
      };

    } else {
      return {
        statusCode: 200,
        body: ''
      };
    }
  } catch (err) {
    console.log("Error creating presigned URL", err);
  }
  return {
    statusCode: 500,
    body: JSON.stringify({
      message: 'There is an error with your request'
    })
  };
};