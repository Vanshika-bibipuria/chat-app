import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // adjust based on your backend
});

export default API;
