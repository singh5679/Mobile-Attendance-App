import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API = axios.create({
  //baseURL: "http://192.168.1.34:5000/api", // your backend URL (Same network)
  // baseURL:"http://10.80.105.21:5000/api",
  baseURL: "https://mobile-attendance-app.onrender.com/api", //(Any network render)
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
  (error) => Promise.reject(error),
);

export default API;

//To start Frontend: cd attendance-frontend && npx expo start
