import axios from 'axios';

export const BASE_URL = 'https://192.168.1.112:3001';
//export const BASE_URL = 'https://8bc1-188-191-29-81.ngrok-free.app';

const $api = axios.create({
    baseURL: BASE_URL,
});

$api.interceptors.request.use((config) => {
    config.headers.set('ngrok-skip-browser-warning', 'true');
    config.headers.Authorization = `Bearer ${localStorage.getItem('jwt')}`;
    return config;
});

export default $api;
