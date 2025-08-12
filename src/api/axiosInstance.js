import axios from "axios";

const baseURL = process.env.REACT_APP_API_BASE_URL || "";

const instance = axios.create({
  baseURL,
  timeout: Number(process.env.REACT_APP_TIMEOUT) || 10000,
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export default instance;
