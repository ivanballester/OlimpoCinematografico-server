const axios = require("axios");

const baseURL = "https://api.themoviedb.org/3";

const tmdb = axios.create({
  baseURL,
  params: {
    api_key: process.env.API_KEY,
  },
});

module.exports = tmdb;
