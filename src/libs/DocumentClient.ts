import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

const client = new DynamoDBClient(
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  process.env.IS_OFFLINE
    ? {
        region: 'us-east-1',
        endpoint: 'http://localhost:8000',
        credentials: { accessKeyId: 'dynamo', secretAccessKey: 'dynamo123' }
      }
    : { region: process.env.AWS_REGION }
);

const DocumentClient = DynamoDBDocument.from(client);

export { DocumentClient };
