import axios from 'axios';

const api = axios.create({
  baseURL: 'https://helping-hands-backend-w4pu.onrender.com/',
});

export default api;
