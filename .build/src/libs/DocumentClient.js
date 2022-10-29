"use strict";
exports.__esModule = true;
exports.DocumentClient = void 0;
var lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
var client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
var client = new client_dynamodb_1.DynamoDBClient(process.env.IS_OFFLINE ?
    {
        region: 'us-east-1',
        endpoint: 'http://localhost:8000',
        credentials: { accessKeyId: 'dynamo', secretAccessKey: 'dynamo123' }
    }
    : { region: process.env.AWS_REGION });
var DocumentClient = lib_dynamodb_1.DynamoDBDocument.from(client);
exports.DocumentClient = DocumentClient;
