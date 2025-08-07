import axios from "axios";

const API_URL =
  "https://reactinterviewtask.codetentaclestechnologies.in/api/user";

export async function deleteUser(id, token) {
  return axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
