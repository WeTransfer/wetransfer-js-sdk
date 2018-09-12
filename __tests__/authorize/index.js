const axios = require('axios');

const authorize = require('../../src/authorize');
const request = require('../../src/request');

jest.mock('axios');

describe('Authorize method', () => {
  beforeEach(() => {
    request.apiKey = 'secret-api-key';
    axios.mockImplementation(() =>
      Promise.resolve({ data: { token: 'json-web-token' } })
    );
  });

  afterEach(() => {
    axios.mockReset();
  });

  it('should create an authorize request', async () => {
    await authorize();
    expect(axios).toHaveBeenLastCalledWith({
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'secret-api-key',
      },
      url: '/v2/authorize',
      data: null,
    });
  });

  it('should return a JWT token', async () => {
    const auth = await authorize();
    expect(auth).toEqual({
      token: 'json-web-token',
    });
  });

  it('should throw an error if request fails', async () => {
    try {
      axios.mockImplementation(() =>
        Promise.reject(new Error('Network error.'))
      );
      await authorize();
    } catch (error) {
      expect(error).toMatchSnapshot();
    }
  });
});
