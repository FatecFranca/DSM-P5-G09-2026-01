import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.hugozera.space', // Connects via cloudflared 
});

export default api;
