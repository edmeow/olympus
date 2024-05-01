import axios from 'axios';

export const BASE_URL = 'http://158.160.166.207:8080';

const $api = axios.create({
    baseURL: BASE_URL,
});

$api.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('jwt')}`;
    return config;
});

export default $api;
