import axios from 'axios';

const api = axios.create({
    baseURL: 'http://10.253.172.142:3333'
});

export default api;