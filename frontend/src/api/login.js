import api from "./api";

export async function postLogin({ username }) {
  const { data } = await api.post("/auth/demo-login", { username });
  return data;
}