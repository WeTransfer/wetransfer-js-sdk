const axios = require('axios');
const { merge } = require('lodash');

axios.defaults.baseURL = 'https://dev.wetransfer.com/';
axios.defaults.method = 'post';

function defaultOptions(apiKey, jwt) {
  const options = {
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey
    }
  };

  if (jwt) {
    options.headers['Authorization'] = `Bearer ${jwt}`;
  }

  return options;
}

function send(options = {}, data = null) {
  const requestOptions = merge(
    {},
    defaultOptions(this._apiKey, this._jwt),
    options,
    { data }
  );

  return axios(requestOptions).then((response) => response.data);
}

function upload(uploadUrl, data) {
  const requestOptions = {
    url: uploadUrl,
    method: 'put',
    data
  };
  return axios(requestOptions).then((response) => response.data);
}

module.exports = {
  send,
  upload,
  set apiKey(apiKey) {
    if (!apiKey) {
      throw new Error('No API Key provided');
    }

    this._apiKey = apiKey;
  },
  set jwt(jwt) {
    if (!jwt) {
      throw new Error('No JWT provided');
    }

    this._jwt = jwt;
  }
};
