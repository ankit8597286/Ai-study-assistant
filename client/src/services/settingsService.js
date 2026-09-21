import api from "./api";

export const updateProfile = async (data) => {
  const res = await api.put("/auth/profile", {
    name: data.name,
  });

  return res.data;
};

export const changePassword = async (data) => {
  const res = await api.put("/auth/change-password", {
    currentPassword: data.currentPassword,
    newPassword: data.newPassword,
  });

  return res.data;
};
