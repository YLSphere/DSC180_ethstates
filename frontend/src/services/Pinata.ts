import axios from "axios";

const pinata = axios.create({
  baseURL: "https://api.pinata.cloud",
  timeout: 5000,
});

// Add a request interceptor
pinata.interceptors.request.use(
  (config) => {
    // Add the Bearer token to the request header
    config.headers.Authorization = `Bearer ${import.meta.env.VITE_PINATA_JWT}`;

    config.headers.Accept = "application/json";
    config.headers["Content-Type"] = "application/json";
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

export default pinata;
