import api from "./api";

export const updateProfile =
  async (data) => {

    const res =
      await api.put(
        "/auth/profile",
        data
      );

    return res.data;
  };

export const changePassword =
  async (data) => {

    const res =
      await api.put(
        "/auth/change-password",
        data
      );

    return res.data;
  };