import api from "./api";

export const generateQuiz = async (data) => {
  const res = await api.post("/quiz/generate", data);
  return res.data;
};

export const getQuiz = async (id) => {
  const res = await api.get(`/quiz/${id}`);
  return res.data;
};

export const startQuiz = async (id) => {
  const res = await api.post(`/quiz/${id}/start`);
  return res.data;
};

export const submitQuiz = async (attemptId, answers) => {
  const res = await api.post(`/quiz/attempt/${attemptId}/submit`, { answers });
  return res.data;
};

export const getQuizResult = async (attemptId) => {
  const res = await api.get(`/quiz/attempt/${attemptId}/result`);
  return res.data;
};

export const getQuizHistory = async () => {
  const res = await api.get("/quiz/history");
  return res.data;
};
