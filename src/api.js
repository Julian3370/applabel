import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080', // Reemplaza con la URL base de tu API
});

export default api;