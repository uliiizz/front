import axios from 'axios';

const api = axios.create({
  baseURL: http://18.175.45.133 ?? process.env.VITE_API_URL ?? 'http://localhost:3000',
});

export default api;
