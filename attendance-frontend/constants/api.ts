import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API = axios.create({
    baseURL: 'http://192.168.1.45:5000/api', //PC wifi IP address
    headers: {
        'Content-Type': 'application/json',
    },
    
    
});

API.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API;