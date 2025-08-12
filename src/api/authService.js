import { API } from "../config/apiEndpoints.js";
import axiosInstance from "./axiosInstance";
import { jwtDecode } from "jwt-decode";

export async function login(email, password) {
  try {
    const response = await axiosInstance.post(API.AUTH.LOGIN, {
      email,
      password,
    });
    console.log("LOGIN RESPONSE:", response);

    const data = response.data || {};
    // adjust depending on backend shape
    const token = data.token ?? data?.data?.token ?? data?.access_token;
    const role = data?.data?.role ?? data?.role ?? data?.user?.role;

    if (token) localStorage.setItem("token", token);
    if (role) localStorage.setItem("role", role);
    if (data?.data) localStorage.setItem("user", JSON.stringify(data.data));

    return data;
  } catch (error) {
    console.error(
      "LOGIN ERROR RESPONSE:",
      error.response?.data || error.message
    );
    throw error;
  }
}

export function logout() {
  localStorage.clear();
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
  } catch {
    return null;
  }
}

export function isTokenValid(token = localStorage.getItem("token")) {
  const payload = parseJwt(token);
  if (!payload) return false;
  const now = Math.floor(Date.now() / 1000);

  return typeof payload.exp === "number" && payload.exp > now + 5;
}
