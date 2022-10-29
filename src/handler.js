var AWS = require("aws-sdk");
AWS.config.update({ region: process.env.REGION });
var dynamodb = new AWS.DynamoDB();

exports.emptyResponse = (event, _context, callback) => {
  const response = {
    statusCode: 200,
    headers: {
      "Content-Type": "text/html",
    },
    body: "OK",
  };

  callback(null, response);
};

exports.authorizer = function (event, _context, callback) {
  var token = event.headers.Authorization.replace("Bearer ", "");
  var team = event.queryStringParameters.slug;

  var params = {
    TableName: process.env.TEAMS_TABLE,
    Key: {
      name: { S: team },
    },
    ProjectionExpression: "tokens",
  };

  dynamodb.getItem(params, function (err, data) {
    if (err) {
      callback(null, generatePolicy("unauthenticated", "Deny", "*"));
    } else if (data.Item) {
      if (JSON.parse(data.Item.tokens.S).includes(token)) {
        callback(null, generatePolicy(team, "Allow", "*"));
      } else {
        callback(null, generatePolicy("unauthenticated", "Deny", "*"));
      }
    } else {
      callback(null, generatePolicy("unauthenticated", "Deny", "*"));
    }
  });
};

var generatePolicy = function (principalId, effect, resource) {
  var authResponse = {};

  authResponse.principalId = principalId;
  if (effect && resource) {
    var policyDocument = {};
    policyDocument.Version = "2012-10-17";
    policyDocument.Statement = [];
    var statementOne = {};
    statementOne.Action = "execute-api:Invoke";
    statementOne.Effect = effect;
    statementOne.Resource = resource;
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
  }
  return authResponse;
};
