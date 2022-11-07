const axios = require('axios');

const url = 'https://random-words-api.vercel.app/word/noun';

const getWord = () => {
  const request = axios.get(url);
  return request.then(res => res.data[0].word);
}

const servises = { getWord };

module.exports = servises;