"use strict";
exports.__esModule = true;
exports.GeneratePolicy = void 0;
var GeneratePolicy = function (effect, resource) {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    var policyDocument = {};
    if ((effect !== '') && (resource !== '')) {
        policyDocument.Version = '2012-10-17';
        policyDocument.Statement = [];
        var statementOne = {};
        statementOne.Action = 'execute-api:Invoke';
        statementOne.Effect = effect;
        statementOne.Resource = resource;
        policyDocument.Statement[0] = statementOne;
    }
    return policyDocument;
};
exports.GeneratePolicy = GeneratePolicy;
