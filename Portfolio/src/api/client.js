import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const client = axios.create({ baseURL: API_BASE });

export default client;
export { API_BASE };
