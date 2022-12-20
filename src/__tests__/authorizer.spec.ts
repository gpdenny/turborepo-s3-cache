/* eslint-disable @typescript-eslint/dot-notation */
import { mockClient } from 'aws-sdk-client-mock';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';
import { handler } from '../authorizer';
import { GeneratePolicy } from '../libs/GeneratePolicy';
import event from './apigateway-authorizer.json';

describe('Authorization Handler', () => {
  const ddbMock = mockClient(DynamoDBDocumentClient);

  beforeAll(() => {
    ddbMock.on(GetCommand).resolves({
      Item: { name: 'team_test', tokens: ['test1234'] }
    });
  });

  it('Should return Allow policy for valid tokens & team', async () => {
    event.headers['Authorization'] = 'Bearer test1234';
    event.queryStringParameters['slug'] = 'team_test';

    const expectedPolicy = {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: 'Allow',
          Resource: '*'
        }
      ]
    };

    const policy = await handler(event as any);
    expect(policy).toHaveProperty('principalId', 'team_test');
    expect(policy.policyDocument).toEqual(expectedPolicy);
  });

  it('Should return Deny policy for invalid tokens', async () => {
    event.headers['Authorization'] = 'Bearer 1234';
    event.queryStringParameters['slug'] = 'team_test';

    const expectedPolicy = {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: 'Deny',
          Resource: '*'
        }
      ]
    };

    const policy = await handler(event as any);
    expect(policy).toHaveProperty('principalId', 'unknown');
    expect(policy.policyDocument).toEqual(expectedPolicy);
  });

  it('Should return Deny policy for missing token and team', async () => {
    event.headers = {};
    event.queryStringParameters = {};

    const expectedPolicy = {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: 'Deny',
          Resource: '*'
        }
      ]
    };

    const policy = await handler(event as any);
    expect(policy).toHaveProperty('principalId', 'unknown');
    expect(policy.policyDocument).toEqual(expectedPolicy);
  });

  it('Should return Deny policy for invalid teams', async () => {
    event.headers['Authorization'] = 'Bearer 1234';
    event.queryStringParameters['slug'] = 'missing_team';

    const expectedPolicy = {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: 'Deny',
          Resource: '*'
        }
      ]
    };

    const policy = await handler(event as any);
    expect(policy).toHaveProperty('principalId', 'unknown');
    expect(policy.policyDocument).toEqual(expectedPolicy);
  });

  it('Should return Deny policy for missing team', async () => {
    ddbMock.on(GetCommand).resolves({
      Item: {}
    });

    event.headers['Authorization'] = 'Bearer test1234';
    event.queryStringParameters['slug'] = 'team_test';

    const expectedPolicy = {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: 'Deny',
          Resource: '*'
        }
      ]
    };

    const policy = await handler(event as any);
    expect(policy).toHaveProperty('principalId', 'unknown');
    expect(policy.policyDocument).toEqual(expectedPolicy);
  });

  it('Should return Deny policy on DynamoDB Error', async () => {
    ddbMock.on(GetCommand).rejects();

    event.headers['Authorization'] = 'Bearer 1234';
    event.queryStringParameters['slug'] = 'missing_team';

    const expectedPolicy = {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: 'Deny',
          Resource: '*'
        }
      ]
    };

    const policy = await handler(event as any);
    expect(policy).toHaveProperty('principalId', 'unknown');
    expect(policy.policyDocument).toEqual(expectedPolicy);
  });

  describe('Policy Generator', () => {
    it('Should return an empty policy document if no effect or resource', async () => {
      const expectedPolicy = {};
      const policy = GeneratePolicy('', '');
      expect(policy).toEqual(expectedPolicy);
    });
  });
});
