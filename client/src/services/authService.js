import api from "./api";

export const logout = async () => {
  const res = await api.post("/auth/logout");
  return res.data;
};
