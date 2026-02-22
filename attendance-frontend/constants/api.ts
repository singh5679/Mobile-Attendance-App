// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const API = axios.create({
//     baseURL: 'http://192.168.1.45:5000/api', //PC wifi IP address
//     headers: {
//         'Content-Type': 'application/json',
//     },
    
    
// });

// API.interceptors.request.use(async (req) => {
//     const token = await AsyncStorage.getItem('token');
//     if (token) {
//         req.headers.Authorization = `Bearer ${token}`;
//     }
//     return req;
// });

// export default API;

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API = axios.create({
  //baseURL: "http://192.168.1.45:5000/api", // your backend URL
  // baseURL: "https://proprietarily-scalenohedral-deegan.ngrok-free.dev/api",
  baseURL:"http://10.80.105.21:5000/api",

});

// 🔥 ADD THIS INTERCEPTOR
API.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
