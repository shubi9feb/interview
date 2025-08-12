import axios from "axios";
import { API } from "../config/apiEndpoints";

// Create an axios instance for reusability
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL, // or NEXT_PUBLIC_API_BASE_URL for Next.js
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Add token to requests if needed
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // Adjust if you store token differently
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---------- Auth ----------
export const login = (data) => axiosInstance.post(API.AUTH.LOGIN, data);
export const register = (data) => axiosInstance.post(API.AUTH.REGISTER, data);

// ---------- Users ----------
export const getUserList = () => axiosInstance.get(API.USERS.LIST);
export const deleteUser = (id) =>
  axiosInstance.delete(`${API.USERS.DELETE}/${id}`);

// ---------- Products ----------
export const getProductList = (page = 1, perPage = 10) =>
  axiosInstance.get(`${API.PRODUCTS.LIST}?page=${page}&perPage=${perPage}`);

export const addProduct = (data) => axiosInstance.post(API.PRODUCTS.ADD, data);

// ---------- Location ----------
export const getCountries = () => axiosInstance.get(API.LOCATION.COUNTRIES);
export const getStates = (countryId) =>
  axiosInstance.get(`${API.LOCATION.STATES}?country_id=${countryId}`);

const apiActions = {
  login,
  register,
  getUserList,
  deleteUser,
  getProductList,
  addProduct,
  getCountries,
  getStates,
};

export default apiActions;
