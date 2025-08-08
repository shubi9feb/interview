import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_URL =
  "https://reactinterviewtask.codetentaclestechnologies.in/api/api/login";

export async function login(email, password) {
  try {
    const response = await axios.post(API_URL, { email, password });

    console.log("LOGIN RESPONSE:", response);

    const { token, role } = response.data;

    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
    }

    return response.data;
  } catch (error) {
    console.error(
      "LOGIN ERROR RESPONSE:",
      error.response?.data || error.message
    );
    throw error;
  }
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("user");
  window.location.href = "/login";
}

export function getCurrentUser() {
  return JSON.parse(localStorage.getItem("user"));
}

export function getToken() {
  return localStorage.getItem("token");
}

export function getRole() {
  return localStorage.getItem("role");
}

export function parseJwt(token) {
  try {
    return token ? jwtDecode(token) : null;
  } catch (e) {
    return null;
  }
}

export function isTokenValid(token = localStorage.getItem("token")) {
  const payload = parseJwt(token);
  if (!payload) return false;
  const now = Math.floor(Date.now() / 1000);

  return typeof payload.exp === "number" && payload.exp > now + 5;
}
