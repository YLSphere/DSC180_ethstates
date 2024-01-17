import axios from "axios";

export const pinataJson = axios.create({
  baseURL: "https://api.pinata.cloud",
  timeout: 5000,
});

// Add a request interceptor
pinataJson.interceptors.request.use(
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

export const pinataImage = axios.create({
  baseURL: "https://api.pinata.cloud",
  timeout: 10000,
});

pinataImage.interceptors.request.use(
  (config) => {
    // Add the Bearer token to the request header
    config.headers.Authorization = `Bearer ${import.meta.env.VITE_PINATA_JWT}`;

    config.headers.Accept = "application/json";
    config.headers["Content-Type"] = "multipart/form-data";
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

export const pinataGateway = axios.create({
  baseURL: import.meta.env.VITE_PINATA_GATEWAY,
  timeout: 5000,
});

pinataGateway.interceptors.request.use(
  (config) => {
    config.headers.Accept = "application/json";
    config.headers["Content-Type"] = "application/json";
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);
