import axiosInstance from "./axiosInstance";

const API_URL =
  "https://reactinterviewtask.codetentaclestechnologies.in/api/api/user-delete";

export async function deleteUser(id) {
  return axiosInstance.post(`${API_URL}/${id}`);
}
