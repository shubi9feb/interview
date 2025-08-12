// src/config/apiEndpoints.js
const BASE_URL = process.env.REACT_APP_API_BASE_URL; // or NEXT_PUBLIC_API_BASE_URL for Next.js

export const API = {
  AUTH: {
    LOGIN: `${BASE_URL}/login`,
    REGISTER: `${BASE_URL}/register`,
  },
  USERS: {
    LIST: `${BASE_URL}/user-list`,
    DELETE: `${BASE_URL}/user-delete`,
  },
  PRODUCTS: {
    ADD: `${BASE_URL}/add-product`,
    LIST: `${BASE_URL}/product-list`,
  },
  LOCATION: {
    COUNTRIES: `${BASE_URL}/country-list`,
    STATES: `${BASE_URL}/state-list`,
  },
};
