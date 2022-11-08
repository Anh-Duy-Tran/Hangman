const axios = require('axios');
require('dotenv').config()

const url = `https://api.giphy.com/v1/gifs/search?api_key=${process.env.GIPHY_API_KEY}&limit=3&q=`;
// const url = `https://api.giphy.com/v1/gifs/search?api_key=6GdKH0mx4OqlX8WGXvmwYKsF04fQDV9B&limit=3&q=`;

const getClues = async req => {
  const res = await axios.get(url + req);
  let clues = []

  Array.from(res.data.data).forEach(gif => {
    clues.push(`https://i.giphy.com/media/${gif.id}/200.gif`);
  });

  return clues;
}

const services = { getClues }
module.exports = services