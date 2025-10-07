import api from "./api";

export async function postLogout() {
  await api.post("/auth/logout");
  localStorage.removeItem("username");
}