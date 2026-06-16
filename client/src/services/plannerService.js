import api from "./api";

export const generatePlanner =
  async (data) => {

    const res =
      await api.post(
        "/planner/generate",
        data
      );

    return res.data;
  };

export const getPlannerHistory =
  async () => {

    const res =
      await api.get(
        "/planner/history"
      );

    return res.data;
  };