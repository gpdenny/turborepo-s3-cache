/* eslint-disable @typescript-eslint/dot-notation */
import {
  GetObjectCommand,
  PutObjectCommand
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { handler } from '../s3Signer';
import event from './apigateway-authorizer.json';

const mockedFn = jest.fn().mockResolvedValue('https://example.com/');
jest.mock('@aws-sdk/s3-request-presigner', () => {
  return {
    getSignedUrl: jest.fn().mockImplementation(() => mockedFn())
  };
});

describe('S3 Signer Handler', () => {
  it('Should return signed URL redirect for OPTIONS request with method GET', async () => {
    event.headers['access-control-request-method'] = 'GET';
    const response = await handler(event as any);

    expect(getSignedUrl).toHaveBeenCalledWith(
      expect.any(Object),
      expect.any(GetObjectCommand),
      { expiresIn: 60 }
    );

    expect(response).toEqual({
      statusCode: 200,
      headers: {
        Location: 'https://example.com/'
      },
      body: ''
    });
  });

  it('Should return signed URL redirect for OPTIONS request with method PUT', async () => {
    event.headers['access-control-request-method'] = 'PUT';
    const response = await handler(event as any);

    expect(getSignedUrl).toHaveBeenCalledWith(
      expect.any(Object),
      expect.any(PutObjectCommand),
      { expiresIn: 60 }
    );

    expect(response).toEqual({
      statusCode: 200,
      headers: {
        Location: 'https://example.com/'
      },
      body: ''
    });
  });

  it('Should return 200 for OPTIONS request with other method', async () => {
    event.headers['access-control-request-method'] = 'POST';
    const response = await handler(event as any);
    expect(response).toEqual({
      statusCode: 200,
      body: ''
    });
  });

  it('Should return 500 on getSignedURL failure', async () => {
    mockedFn.mockRejectedValue(new Error('Error'));

    event.headers['access-control-request-method'] = 'GET';
    const response = await handler(event as any);
    expect(response).toEqual({
      statusCode: 500,
      body: JSON.stringify({
        message: 'There is an error with your request'
      })
    });
  });
});
