import axios from "axios";

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
