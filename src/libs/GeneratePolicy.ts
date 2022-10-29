import type { PolicyDocument } from 'aws-lambda';

const GeneratePolicy = (effect: string, resource: string): PolicyDocument => {
    const policyDocument = {} as PolicyDocument
    if (effect && resource) {
      policyDocument.Version = '2012-10-17'
      policyDocument.Statement = []
      const statementOne: any = {}
      statementOne.Action = 'execute-api:Invoke'
      statementOne.Effect = effect
      statementOne.Resource = resource
      policyDocument.Statement[0] = statementOne
    }
    return policyDocument
}

export { GeneratePolicy };
