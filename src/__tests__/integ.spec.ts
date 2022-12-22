import axios from 'axios';

describe('Integration Tests', () => {
  describe('Authorization', () => {
    it('Should return 401 status for missing token', async () => {
      const apiUrl = "http://localhost:3000/v8/artifacts/does-not-exist";
      await axios.options(apiUrl,
        {
          headers: {
            'access-control-request-method': 'GET'
          },
          params: {
            slug: 'test'
          }
        }).then(res => {
        }).catch(err => {
          expect(err.response.status).toBe(401);
        })
    });

    it('Should return 403 status for missing team', async () => {
      const apiUrl = "http://localhost:3000/v8/artifacts/does-not-exist";
      await axios.options(apiUrl,
        {
          headers: {
            'access-control-request-method': 'GET',
            'Authorization': 'Bearer test123'
          },
        }).then(res => {
        }).catch(err => {
          expect(err.response.status).toBe(403);
        })
    });
    it('Should return 403 status for incorrect team / token', async () => {
      const apiUrl = "http://localhost:3000/v8/artifacts/does-not-exist";
      await axios.options(apiUrl,
        {
          headers: {
            'access-control-request-method': 'GET',
            'Authorization': 'Bearer notatoken'
          },
          params: {
            'slug': 'notateam',
          },
        }).then(res => {
        }).catch(err => {
          expect(err.response.status).toBe(403);
        })
    });
  });
  describe('Requests', () => {
    describe('GET Method', () => {
      it('Should return a signed URL in the location header', async () => {
        const apiUrl = "http://localhost:3000/v8/artifacts/does-not-exist";
        await axios.options(apiUrl,
          {
            headers: {
              'access-control-request-method': 'GET',
              'Authorization': 'Bearer test123'
            },
            params: {
              'slug': 'test',
            },
          }).then(res => {
            expect(res.status).toBe(200)
            expect(res.headers).toHaveProperty('location')
          })
      });
    });
    describe('PUT Method', () => {
      it('Should return a signed URL in the location header', async () => {
        const apiUrl = "http://localhost:3000/v8/artifacts/does-not-exist";
        await axios.options(apiUrl,
          {
            headers: {
              'access-control-request-method': 'PUT',
              'Authorization': 'Bearer test123'
            },
            params: {
              'slug': 'test',
            },
          }).then(res => {
            expect(res.status).toBe(200)
            expect(res.headers).toHaveProperty('location')
          })
      });
    });
    describe('PUT Method', () => {
      it('Should return an empty 200 for other methods', async () => {
        const apiUrl = "http://localhost:3000/v8/artifacts/does-not-exist";
        await axios.options(apiUrl,
          {
            headers: {
              'access-control-request-method': 'POST',
              'Authorization': 'Bearer test123'
            },
            params: {
              'slug': 'test',
            },
          }).then(res => {
            expect(res.status).toBe(200)
            expect(res.data).toHaveLength(0)
          })
      });
    });
  });
});