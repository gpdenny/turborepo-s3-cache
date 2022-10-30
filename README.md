# Turborepo S3 Cache
![serverless-badge](https://img.shields.io/badge/serverless-%3E%3Dv3.0-red?logo=serverless)
![node-badge](https://img.shields.io/badge/node.js-%3E%3Dv16.0-red?logo=node.js)
![ci-badge](https://github.com/gpdenny/turborepo-s3-cache/actions/workflows/main.yml/badge.svg)
![stars-badge](https://img.shields.io/github/stars/gpdenny/turborepo-s3-cache?logo=github)
![license-badge](https://img.shields.io/github/license/gpdenny/turborepo-s3-cache)

Serverless Turborepo remote caching using API Gateway and S3.

## Description

This project is a serverless implementation of the [Turborepo custom remote cache server](https://turbo.build/repo/docs/core-concepts/remote-caching#custom-remote-caches).

It uses API Gateway as a proxy for storing cache artifacts in S3 and Dynamodb to provide basic authentication.

Build and Deployment is managed by the [Serverless Framework](http://serverless.com/) for ease of use.

![diagram](docs/diagram.png)
## Getting Started

### Dependencies

## Authors

[Gareth Denny](https://twitter.com/gazdenny)

## Acknowledgments

Inspiration, code snippets, etc.
* [turborepo-remote-cache](https://github.com/ducktors/turborepo-remote-cache)
* [Serverless Apigateway Service Proxy](https://www.serverless.com/plugins/serverless-apigateway-service-proxy)
* [Tommy Parnell](https://blog.terrible.dev/Building-a-remote-cache-server-for-Turborepo/)