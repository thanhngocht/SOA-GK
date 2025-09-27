// src/services/userService.js
import api from "./api";

export async function getMe() {
  const { data } = await api.get("/user/me");
  return data; // { username, email, name, balance, ... }
}
