import axios from 'axios';

const API = axios.create({
    baseURL: 'http://192.168.1.40:5000/api', //PC wifi IP address
    timeout: 10000,
    //baseURL: 'http://localhost:5000/api',
    
});

export default API;