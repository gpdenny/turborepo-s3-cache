import type { APIGatewayRequestAuthorizerEvent, AuthResponse, PolicyDocument } from 'aws-lambda';
import { DocumentClient } from './libs/DocumentClient'
import { GeneratePolicy } from './libs/GeneratePolicy'

const teamsTable = process.env.TEAMS_TABLE

const handler = async (event: APIGatewayRequestAuthorizerEvent): Promise<AuthResponse> => {
  const token = (event.headers?.Authorization ?? '').replace('Bearer ', '');
  const team = event.queryStringParameters?.slug ?? '';

  const params = {
    TableName: teamsTable,
    Key: {
      'name': team,
    },
    ProjectionExpression: 'tokens',
  };

  try {
    const data = await DocumentClient.get(params);
    if (JSON.parse(data.Item?.tokens).includes(token)) {
      // Valid Token
      return {
        principalId: team,
        policyDocument: GeneratePolicy('Allow', '*')
      }
    }
  } catch (err) {
    console.log(err)
    // DynamoDB Error
    return {
      principalId: 'unknown',
      policyDocument: GeneratePolicy('Deny', '*')
    }
  }

  // Default Deny
  return {
    principalId: 'unknown',
    policyDocument: GeneratePolicy('Deny', '*')
  }
};

export { handler };