const axios = require('axios');

const url = 'https://random-word.ryanrk.com/api/en/word/random';

const getWord = () => {
  const request = axios.get(url);
  return request.then(res => res.data[0]);
}

const servises = { getWord };

module.exports = servises;