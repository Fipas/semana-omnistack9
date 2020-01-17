import axios from 'axios';

const api = axios.create({
    baseURL: 'http://10.200.23.214:3333'
});

export default api;