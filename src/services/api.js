import axios from 'axios';

const api = axios.create({
  baseURL: 'https://all-commerce-api.onrender.com ',
});

export default api;