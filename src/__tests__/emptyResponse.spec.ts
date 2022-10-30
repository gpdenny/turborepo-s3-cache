import { handler } from '../emptyResponse';
import event from './apigateway-aws-proxy.json';

describe('Empty Response handler', () => {
  it('Should return 200 Status Code', async () => {
    const result = await handler(event);
    expect(result?.statusCode).toBe(200);
  });
});
